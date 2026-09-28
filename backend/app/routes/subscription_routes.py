from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from datetime import datetime, timedelta
import uuid
from app.models import SubscriptionCheckoutRequest
from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/api/subscriptions", tags=["Subscriptions"])

@router.post("/checkout")
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

    # Create notifications for user and admin
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

@router.get("/user/{user_id}")
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
