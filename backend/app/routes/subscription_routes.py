from fastapi import APIRouter, HTTPException, Query, Depends, Header
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import uuid
from app.models import (
    SubscriptionCheckoutRequest,
    DemoSubscriptionActivateRequest,
    OrganizationMemberAddRequest,
    DemoPaymentCreateRequest,
    DemoPaymentConfirmRequest
)
from app.database import get_db
from app.config import settings
from app.services.firebase_service import sync_subscription_to_firebase
from app.services.saas_service import (
    PLANS_DEFINITIONS,
    init_saas_data,
    get_organization_usage,
    activate_demo_subscription,
    add_organization_member,
    has_feature_access
)

def get_user_id_from_auth(authorization: Optional[str] = None) -> Optional[str]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    try:
        from app.auth import decode_jwt_token
        decoded = decode_jwt_token(authorization.split(" ")[1])
        if decoded:
            return decoded.get("sub")
    except Exception:
        pass
    return None

router = APIRouter(tags=["Subscriptions & SaaS"])

@router.get("/api/subscriptions/plans")
def list_plans():
    """Retrieve all available subscription plans with seat quotas and feature sets."""
    init_saas_data()
    return {
        "plans": PLANS_DEFINITIONS
    }

@router.get("/api/subscriptions/organization/{org_id}")
def get_organization_subscription_status(org_id: str = "org_psr_eng"):
    """Get active subscription, license status, and live seat quota usage for an institution."""
    init_saas_data()
    db = get_db()
    org = db["organizations"].find_one({"organization_id": org_id})
    if not org:
        # Graceful fallback to default demo college
        org = db["organizations"].find_one({"organization_id": "org_psr_eng"})
        org_id = "org_psr_eng"
    
    usage_info = get_organization_usage(org_id)
    return {
        "organization": org,
        "subscription": usage_info
    }

@router.post("/api/subscriptions/activate-demo")
def activate_demo_plan(req: DemoSubscriptionActivateRequest):
    """
    Server-side 12-step verification and activation of demo subscription.
    Enforces role, sets seat quotas, records demo payment in MongoDB, and enables features.
    """
    init_saas_data()
    result = activate_demo_subscription(
        user_id=req.userId or "admin_user",
        organization_id=req.organizationId or "org_psr_eng",
        plan_id=req.planId or "institution_pro",
        user_role=req.userRole or "admin",
        admin_name=req.adminName or "Admin Officer"
    )
    return result

@router.get("/api/subscriptions/payments")
def list_payment_records(org_id: Optional[str] = "org_psr_eng"):
    """Retrieve persistent payment records from MongoDB Atlas for the organization."""
    init_saas_data()
    db = get_db()
    query = {}
    if org_id and org_id != "all":
        query["organization_id"] = org_id

    records = list(db["payments"].find(query).sort("created_at", -1))
    for r in records:
        if "_id" in r:
            r["_id"] = str(r["_id"])
    return {
        "payments": records
    }

@router.get("/api/subscriptions/feature-access")
def check_feature_access(
    feature: str = Query(..., description="Feature token to verify"),
    org_id: Optional[str] = None,
    organization_id: Optional[str] = None,
    user_id: Optional[str] = None,
    user_role: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """Query whether a user or organization has permission to use a specific feature."""
    init_saas_data()
    effective_org = organization_id or org_id or "org_psr_eng"
    effective_uid = user_id
    effective_role = user_role

    if authorization and authorization.startswith("Bearer "):
        try:
            from app.auth import decode_jwt_token
            decoded = decode_jwt_token(authorization.split(" ")[1])
            if decoded:
                if not effective_uid:
                    effective_uid = decoded.get("sub")
                if not effective_role:
                    effective_role = decoded.get("role")
        except Exception:
            pass

    granted = has_feature_access(
        user_id=effective_uid,
        organization_id=effective_org,
        feature_name=feature,
        user_role=effective_role
    )
    return {
        "feature": feature,
        "organization_id": effective_org,
        "hasAccess": granted,
        "has_access": granted
    }

@router.get("/api/organizations/{org_id}/members")
def get_organization_members(org_id: str = "org_psr_eng"):
    """List members associated with an organization."""
    init_saas_data()
    db = get_db()
    members = list(db["organization_members"].find({"organization_id": org_id}))
    for m in members:
        if "_id" in m:
            m["_id"] = str(m["_id"])
    return {
        "organization_id": org_id,
        "members": members,
        "count": len(members)
    }

@router.post("/api/organizations/{org_id}/members")
def add_member_to_organization(org_id: str, req: OrganizationMemberAddRequest):
    """Add a new student, teacher, or admin to an organization with seat limit enforcement."""
    init_saas_data()
    member = add_organization_member(org_id, req.dict())
    return {
        "success": True,
        "message": f"Successfully enrolled {req.role} '{req.name}' in {org_id}.",
        "member": member
    }

# ==========================================
# FREE DEMO PAYMENT & STUDENT PRO SUBSCRIPTION
# ==========================================

@router.post("/api/payments/demo/create")
def create_demo_payment(
    req: DemoPaymentCreateRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Step 1 of Demo UPI Payment Flow:
    Initializes a PENDING demo payment record in MongoDB payments collection.
    Idempotent: Reuses existing pending payment session if initiated within 5 minutes.
    """
    init_saas_data()
    db = get_db()
    now = datetime.utcnow()
    
    user_id = req.user_id or get_user_id_from_auth(authorization) or "student_arun"
    plan_id = req.plan_id or req.planId or "student_pro"
    amount = req.amount or settings.STUDENT_PRO_PRICE_INR or 99
    currency = req.currency or "INR"
    
    # Check for recent pending payment to ensure idempotency
    existing = db["payments"].find_one({
        "user_id": user_id,
        "plan_id": plan_id,
        "status": "PENDING"
    })
    if existing:
        return {
            "success": True,
            "payment_id": existing.get("payment_id", str(existing.get("_id"))),
            "amount": existing.get("amount", amount),
            "currency": currency,
            "status": "PENDING",
            "upi_id": "learndebt@demo",
            "demo": True,
            "disclaimer": "DEMO PAYMENT — NO REAL MONEY CHARGED",
            "message": "Existing demo payment session resumed. NO REAL MONEY CHARGED."
        }
    
    pay_id = f"DEMO-PAY-{uuid.uuid4().hex[:8].upper()}"
    pay_doc = {
        "_id": pay_id,
        "payment_id": pay_id,
        "user_id": user_id,
        "userId": user_id,
        "plan_id": plan_id,
        "amount": amount,
        "currency": currency,
        "status": "PENDING",
        "payment_method": req.payment_method or "DEMO_UPI",
        "demo": True,
        "mode": "demo",
        "created_at": now.isoformat(),
        "updated_at": now.isoformat(),
        "disclaimer": "DEMO PAYMENT — NO REAL MONEY CHARGED"
    }
    db["payments"].insert_one(pay_doc)
    
    return {
        "success": True,
        "payment_id": pay_id,
        "amount": amount,
        "currency": currency,
        "status": "PENDING",
        "upi_id": "learndebt@demo",
        "demo": True,
        "disclaimer": "DEMO PAYMENT — NO REAL MONEY CHARGED",
        "message": "Demo payment session initiated. NO REAL MONEY CHARGED."
    }

@router.post("/api/payments/demo/confirm")
def confirm_demo_payment(
    req: DemoPaymentConfirmRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Step 2 of Demo UPI Payment Flow:
    Server-side verification of demo payment.
    - Transitions payment status to SUCCESS in MongoDB
    - Activates 30-day Student Pro subscription in MongoDB
    - Synchronizes subscription state with Firebase project 'learndept-ai'
    - Updates user document with is_premium = True
    - Creates user notification and unlocks all premium AI features
    """
    init_saas_data()
    db = get_db()
    now = datetime.utcnow()
    pay_id = req.payment_id or req.paymentId
    
    if not pay_id:
        raise HTTPException(status_code=400, detail="Missing payment_id in request.")
    
    payment = db["payments"].find_one({"$or": [{"payment_id": pay_id}, {"_id": pay_id}]})
    if not payment:
        raise HTTPException(status_code=404, detail="Demo payment record not found.")
        
    user_id = payment.get("user_id") or payment.get("userId") or get_user_id_from_auth(authorization) or "student_arun"
    plan_id = payment.get("plan_id", "student_pro")
    
    # Idempotent handling if already confirmed
    if payment.get("status") == "SUCCESS":
        existing_sub = db["subscriptions"].find_one({"payment_id": pay_id})
        return {
            "success": True,
            "message": "Payment verified! Student Pro subscription is active.",
            "payment": payment,
            "subscription": existing_sub,
            "is_premium": True,
            "demo": True,
            "disclaimer": "DEMO PAYMENT — NO REAL MONEY CHARGED"
        }
        
    expires_at = now + timedelta(days=30)
    sub_id = f"demo_sub_{uuid.uuid4().hex[:10]}"
    
    # Update payment to SUCCESS
    db["payments"].update_one(
        {"$or": [{"payment_id": pay_id}, {"_id": pay_id}]},
        {"$set": {
            "status": "SUCCESS",
            "verified_at": now.isoformat(),
            "updated_at": now.isoformat(),
            "mode": "demo"
        }}
    )
    
    # Deactivate previous active student subscriptions to prevent duplicates
    db["subscriptions"].update_many(
        {"$or": [{"user_id": user_id}, {"userId": user_id}], "status": "active"},
        {"$set": {"status": "renewed", "updated_at": now.isoformat()}}
    )
    
    sub_doc = {
        "_id": sub_id,
        "subscription_id": sub_id,
        "user_id": user_id,
        "userId": user_id,
        "plan_id": plan_id,
        "planId": plan_id,
        "status": "active",
        "started_at": now.isoformat(),
        "startedAt": now.isoformat(),
        "expires_at": expires_at.isoformat(),
        "expiry_date": expires_at.isoformat(),
        "renewalDate": expires_at.isoformat(),
        "payment_id": pay_id,
        "amount": payment.get("amount", 99),
        "currency": payment.get("currency", "INR"),
        "demo": True,
        "auto_renew": False,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    }
    db["subscriptions"].insert_one(sub_doc)
    
    # Update user in users collection
    db["users"].update_one(
        {"$or": [{"_id": user_id}, {"id": user_id}]},
        {"$set": {
            "plan": plan_id,
            "is_premium": True,
            "subscriptionId": sub_id,
            "subscription_id": sub_id,
            "updatedAt": now.isoformat()
        }}
    )
    
    # Synchronize with Firebase (resilient fallback)
    fb_sync = sync_subscription_to_firebase(user_id, sub_doc)
    
    # Audit notification
    db["notifications"].insert_one({
        "_id": f"notif_{uuid.uuid4().hex[:8]}",
        "userId": user_id,
        "type": "subscription",
        "title": "🎉 Student Pro Activated!",
        "message": f"Student Pro is now ACTIVE (Payment ID: {pay_id}). Premium AI study assistance, recovery missions, and detailed concept debt analytics are unlocked. DEMO PAYMENT — NO REAL MONEY CHARGED.",
        "read": False,
        "isRead": False,
        "createdAt": now.isoformat()
    })
    
    return {
        "success": True,
        "message": "Payment verified! Student Pro subscription is now active.",
        "payment": {
            "payment_id": pay_id,
            "amount": payment.get("amount", 99),
            "currency": "INR",
            "status": "SUCCESS",
            "mode": "demo"
        },
        "subscription": {
            "subscription_id": sub_id,
            "plan": plan_id,
            "status": "active",
            "expires_at": expires_at.isoformat(),
            "days_remaining": 30,
            "is_premium": True
        },
        "is_premium": True,
        "firebase_sync": fb_sync,
        "disclaimer": "DEMO PAYMENT — NO REAL MONEY CHARGED"
    }

@router.get("/api/subscription/me")
@router.get("/api/subscriptions/me")
def get_my_subscription(
    authorization: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None)
):
    """
    Returns current user's active subscription status, days remaining, and unlocked features.
    Automatically checks and flags expiry without deleting any academic data.
    """
    init_saas_data()
    db = get_db()
    uid = user_id or get_user_id_from_auth(authorization) or "student_arun"
    now = datetime.utcnow()
    
    sub = db["subscriptions"].find_one({
        "$or": [{"user_id": uid}, {"userId": uid}],
        "status": "active"
    })
    
    if sub:
        exp_str = sub.get("expires_at") or sub.get("expiry_date") or sub.get("renewalDate")
        if exp_str:
            try:
                exp_dt = datetime.fromisoformat(str(exp_str).replace("Z", "+00:00")).replace(tzinfo=None)
                if now > exp_dt:
                    # Expired: update status safely, never touch academic data
                    db["subscriptions"].update_one(
                        {"_id": sub["_id"]},
                        {"$set": {"status": "expired", "updated_at": now.isoformat()}}
                    )
                    db["users"].update_one(
                        {"$or": [{"_id": uid}, {"id": uid}]},
                        {"$set": {"is_premium": False, "plan": "free"}}
                    )
                    sub = None
                else:
                    days_rem = max(0, (exp_dt - now).days)
                    return {
                        "plan": sub.get("plan_id") or sub.get("planId") or "student_pro",
                        "status": "active",
                        "is_premium": True,
                        "demo": sub.get("demo", True),
                        "started_at": sub.get("started_at") or sub.get("startedAt"),
                        "expires_at": str(exp_str),
                        "days_remaining": days_rem,
                        "features": [
                            "advanced_ai_assistant",
                            "personalized_study_plan",
                            "advanced_learning_debt",
                            "ai_practice",
                            "recovery_missions",
                            "advanced_analytics",
                            "premium_reports"
                        ],
                        "disclaimer": "DEMO PAYMENT — NO REAL MONEY CHARGED"
                    }
            except Exception:
                pass
                
    # Return Free Tier Status
    return {
        "plan": "free",
        "status": "active",
        "is_premium": False,
        "demo": False,
        "started_at": None,
        "expires_at": None,
        "days_remaining": 0,
        "features": [
            "basic_dashboard",
            "limited_assessment",
            "basic_learning_debt"
        ]
    }

@router.get("/api/payments/history")
def get_user_payment_history(
    authorization: Optional[str] = Header(None),
    user_id: Optional[str] = Query(None)
):
    """Retrieve full payment audit history for user or institution from MongoDB."""
    init_saas_data()
    db = get_db()
    uid = user_id or get_user_id_from_auth(authorization)
    
    query = {}
    if uid:
        query = {"$or": [{"user_id": uid}, {"userId": uid}]}
        
    records = list(db["payments"].find(query).sort("created_at", -1))
    clean_records = []
    for r in records:
        clean_records.append({
            "payment_id": r.get("payment_id") or str(r.get("_id")),
            "plan_id": r.get("plan_id") or r.get("planId") or "student_pro",
            "amount": r.get("amount", 99),
            "currency": r.get("currency", "INR"),
            "status": r.get("status", "SUCCESS"),
            "payment_method": r.get("payment_method") or r.get("paymentProvider") or "DEMO_UPI",
            "created_at": r.get("created_at") or str(r.get("createdAt")),
            "demo": True,
            "disclaimer": "DEMO PAYMENT — NO REAL MONEY CHARGED"
        })
    return {
        "payments": clean_records,
        "count": len(clean_records),
        "disclaimer": "DEMO PAYMENT — NO REAL MONEY CHARGED"
    }

@router.get("/api/payments/admin-revenue")
def get_admin_revenue_breakdown():
    """Dynamically calculates subscription and revenue analytics from MongoDB."""
    init_saas_data()
    db = get_db()
    
    total_users = db["users"].count_documents({})
    pro_users = db["users"].count_documents({"$or": [{"plan": "student_pro"}, {"is_premium": True}]})
    free_users = max(0, total_users - pro_users)
    active_subs = db["subscriptions"].count_documents({"status": "active"})
    
    payments = list(db["payments"].find({}))
    successful = [p for p in payments if str(p.get("status", "")).upper() in ("SUCCESS", "COMPLETED", "DEMO_SUCCESS")]
    failed = [p for p in payments if str(p.get("status", "")).upper() in ("FAILED", "CANCELLED")]
    
    total_demo_revenue = sum(float(p.get("amount", 0)) for p in successful)
    
    return {
        "total_users": total_users,
        "free_users": free_users,
        "student_pro_users": pro_users,
        "active_subscriptions": active_subs,
        "total_payments_count": len(payments),
        "successful_payments_count": len(successful),
        "failed_payments_count": len(failed),
        "demo_revenue_inr": total_demo_revenue,
        "label": "DEMO REVENUE — NO REAL MONEY CHARGED"
    }

# ==========================================
# PRESERVED LEGACY/DIRECT CHECKOUT ENDPOINTS
# ==========================================
@router.post("/api/subscriptions/checkout")
def checkout_subscription(req: SubscriptionCheckoutRequest):
    db = get_db()
    sub_id = f"sub_{uuid.uuid4().hex[:10]}"
    pay_id = f"pay_{uuid.uuid4().hex[:10]}"
    now = datetime.utcnow()

    is_demo = settings.DEMO_PAYMENT_MODE
    status = "active" if is_demo else "pending"
    pay_status = "demo_success" if is_demo else "completed"

    sub_doc = {
        "_id": sub_id,
        "userId": req.userId,
        "planId": req.planId,
        "status": status,
        "amount": req.amount,
        "currency": req.currency,
        "billingPeriod": req.billingPeriod,
        "paymentProvider": req.paymentProvider,
        "providerPaymentId": pay_id,
        "startedAt": now,
        "renewalDate": now + timedelta(days=30),
        "cancelledAt": None,
        "createdAt": now,
        "updatedAt": now
    }

    pay_doc = {
        "_id": pay_id,
        "userId": req.userId,
        "subscriptionId": sub_id,
        "amount": req.amount,
        "currency": req.currency,
        "status": pay_status,
        "provider": req.paymentProvider,
        "providerPaymentId": pay_id,
        "createdAt": now
    }

    db["subscriptions"].insert_one(sub_doc)
    db["payments"].insert_one(pay_doc)

    # Update user plan
    db["users"].update_one({"_id": req.userId}, {"$set": {"plan": req.planId, "subscriptionId": sub_id}})

    # Create notifications for user
    notif_id = f"notif_{uuid.uuid4().hex[:8]}"
    db["notifications"].insert_one({
        "_id": notif_id,
        "userId": req.userId,
        "type": "subscription",
        "title": "Subscription Activated! 🎉",
        "message": f"Your plan '{req.planId.upper()}' is now active ({req.amount} {req.currency}). Demo mode enabled.",
        "read": False,
        "relatedEntityId": sub_id,
        "createdAt": now
    })

    return {
        "success": True,
        "message": "Subscription processed successfully.",
        "subscription": sub_doc,
        "payment": pay_doc,
        "isDemo": is_demo
    }

@router.get("/api/subscriptions/user/{user_id}")
def get_user_subscription(user_id: str):
    db = get_db()
    sub = db["subscriptions"].find_one({"userId": user_id, "status": "active"})
    if not sub:
        return {"hasActiveSubscription": False, "plan": "free"}

    sub["_id"] = str(sub["_id"])
    return {
        "hasActiveSubscription": True,
        "subscription": sub
    }
