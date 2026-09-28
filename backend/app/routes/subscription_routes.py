from fastapi import APIRouter, HTTPException, Query, Depends, Header
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import uuid
from app.models import (
    SubscriptionCheckoutRequest,
    DemoSubscriptionActivateRequest,
    OrganizationMemberAddRequest
)
from app.database import get_db
from app.config import settings
from app.services.saas_service import (
    PLANS_DEFINITIONS,
    init_saas_data,
    get_organization_usage,
    activate_demo_subscription,
    add_organization_member,
    has_feature_access
)

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
