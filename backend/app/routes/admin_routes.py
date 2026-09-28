from fastapi import APIRouter
from typing import Dict, Any
from app.database import get_db

router = APIRouter(prefix="/api/admin", tags=["Admin"])

def run_seed():
    from scripts.seed import seed_database
    seed_database()

@router.post("/seed")
def seed_endpoint():
    run_seed()
    return {"success": True, "message": "Database seeded successfully with demo users, questions, and records."}

@router.get("/dashboard")
def get_admin_dashboard():
    db = get_db()

    raw_users = list(db["users"].find({}))
    if len(raw_users) <= 1:
        run_seed()
        raw_users = list(db["users"].find({}))

    users_list = []
    for u in raw_users:
        users_list.append({
            "id": str(u.get("_id", u.get("id", ""))),
            "name": u.get("name", "User"),
            "email": u.get("email", ""),
            "role": u.get("role", "student"),
            "department": u.get("department", "Computer Science"),
            "year": u.get("year", "3rd Year"),
            "createdAt": str(u.get("createdAt", "")),
            "lastLoginAt": str(u.get("lastLoginAt", u.get("createdAt", "")))
        })

    total_users = len(users_list)
    total_students = db["students"].count_documents({})
    total_questions = db["questions"].count_documents({})
    total_assessments = db["assessments"].count_documents({})
    total_subscriptions = db["subscriptions"].count_documents({})
    active_subscriptions = db["subscriptions"].count_documents({"status": "active"})

    # Revenue calculation from active subscriptions
    payments = list(db["payments"].find({"status": {"$in": ["success", "demo_success"]}}))
    total_revenue = sum([p.get("amount", 0) for p in payments])
    mrr = active_subscriptions * 299

    recent_payments = list(db["payments"].find({}).sort("createdAt", -1).limit(5))
    for p in recent_payments:
        p["_id"] = str(p.get("_id"))

    return {
        "metrics": {
            "totalUsers": total_users,
            "totalStudents": total_students,
            "totalQuestions": total_questions,
            "totalAssessments": total_assessments,
            "activeSubscriptions": active_subscriptions,
            "totalSubscriptions": total_subscriptions,
            "mrr": mrr,
            "totalRevenue": total_revenue
        },
        "users": users_list,
        "recentPayments": recent_payments
    }

from pydantic import BaseModel
from typing import Optional
from app.database import get_db, get_connection_info, connect_to_mongodb
from app.config import settings

class MongoConnectRequest(BaseModel):
    mongodbUri: str
    databaseName: Optional[str] = "learndebt"

@router.get("/database-status")
def get_database_status():
    db = get_db()
    conn_info = get_connection_info()

    collections_to_check = [
        "users",
        "students",
        "subjects",
        "concepts",
        "questions",
        "assessments",
        "question_attempts",
        "student_concepts",
        "learning_debt_history",
        "notifications",
        "subscriptions",
        "payments",
        "department_assignments"
    ]

    users_check = db["users"].count_documents({})
    if users_check <= 1:
        run_seed()

    collections_summary = {}
    for col in collections_to_check:
        collections_summary[col] = db[col].count_documents({})

    users_list = list(db["users"].find({}))
    user_logins = []
    for u in users_list:
        user_logins.append({
            "id": str(u.get("_id", u.get("id", ""))),
            "name": u.get("name", "User"),
            "email": u.get("email", ""),
            "role": u.get("role", "student"),
            "department": u.get("department", "Computer Science"),
            "lastLoginAt": str(u.get("lastLoginAt", u.get("createdAt", "")))
        })

    return {
        "status": conn_info["status"],
        "isAtlas": conn_info["isAtlas"],
        "maskedUri": conn_info["maskedUri"],
        "databaseName": conn_info["databaseName"],
        "envFile": "backend/.env",
        "collections": collections_summary,
        "totalLoginsRegistered": len(users_list),
        "userLogins": user_logins
    }

@router.post("/database/connect")
def test_and_connect_mongodb(req: MongoConnectRequest):
    uri = req.mongodbUri.strip()
    db_name = req.databaseName.strip() if req.databaseName else "learndebt"
    
    success, message = connect_to_mongodb(uri, db_name)
    if success:
        run_seed()
    
    conn_info = get_connection_info()
    return {
        "success": success,
        "message": message,
        "isAtlas": conn_info["isAtlas"],
        "maskedUri": conn_info["maskedUri"],
        "databaseName": db_name
    }

