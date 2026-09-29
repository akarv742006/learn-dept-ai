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
            "role": u.get("role", "student").capitalize(),
            "institution": u.get("college") or u.get("institution") or "Anna University",
            "department": u.get("department", "Computer Science"),
            "year": u.get("year", "3rd Year"),
            "status": "Active",
            "lastActive": str(u.get("lastLoginAt", u.get("updatedAt", "Recently"))),
            "createdAt": str(u.get("createdAt", "")),
            "lastLoginAt": str(u.get("lastLoginAt", u.get("createdAt", "")))
        })

    student_count_from_users = db["users"].count_documents({"role": {"$in": ["student", "Student"]}})
    student_count_from_students = db["students"].count_documents({})
    total_students = max(student_count_from_users, student_count_from_students)
    total_users = len(users_list)
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

@router.get("/directory")
def get_directory():
    """Returns all students, staff, and parents stored in the database with their profiles"""
    db = get_db()
    users = list(db["users"].find({}))
    if len(users) <= 1:
        run_seed()
        users = list(db["users"].find({}))

    students_db = list(db["students"].find({}))
    student_meta = {s.get("userId"): s for s in students_db}

    students = []
    staff = []
    parents = []

    for u in users:
        uid = str(u.get("_id", u.get("id")))
        role = u.get("role", "student").lower()
        if role == "student":
            s_doc = student_meta.get(uid, {})
            students.append({
                "id": uid,
                "name": u.get("name"),
                "email": u.get("email"),
                "phone": u.get("phone", s_doc.get("phone", "+91 98450 11223")),
                "rollNumber": u.get("rollNumber") or s_doc.get("rollNumber", "CS2023-042"),
                "department": u.get("department") or s_doc.get("department", "Computer Science"),
                "year": u.get("year") or s_doc.get("year", "3rd Year"),
                "attendance": s_doc.get("attendance", 92),
                "learningDebt": s_doc.get("learningDebt", 42),
                "riskLevel": s_doc.get("riskLevel", "Medium"),
                "overallPerformance": s_doc.get("overallPerformance", 78),
                "linkedParentName": s_doc.get("linkedParentName", "Ramesh Sharma"),
                "linkedParentPhone": s_doc.get("linkedParentPhone", "+91 98450 12345")
            })
        elif role in ["teacher", "admin"]:
            staff.append({
                "id": uid,
                "name": u.get("name"),
                "email": u.get("email"),
                "phone": u.get("phone", "+91 63797 62186"),
                "role": role,
                "staffId": u.get("staffId", f"STAFF-{uid[-4:]}"),
                "designation": u.get("designation", "Faculty Member"),
                "department": u.get("department", "Computer Science"),
                "year": u.get("year", "Faculty")
            })
        elif role == "parent":
            parents.append({
                "id": uid,
                "name": u.get("name"),
                "email": u.get("email"),
                "phone": u.get("phone", "+91 98450 12345"),
                "relationship": u.get("relationship", "Parent"),
                "preferredLanguage": u.get("preferredLanguage", "hi"),
                "linkedStudentId": u.get("linkedStudentId", "student_arun"),
                "linkedStudentName": u.get("linkedStudentName", "Arun Kumar"),
                "childRollNo": u.get("childRollNo", "CS2023-042")
            })

    return {
        "summary": {
            "totalStudents": len(students),
            "totalStaff": len(staff),
            "totalParents": len(parents),
            "totalDirectory": len(students) + len(staff) + len(parents)
        },
        "students": students,
        "staff": staff,
        "parents": parents
    }

@router.post("/sync-firebase-directory")
def sync_firebase_directory():
    """Syncs all students, staff, and parents in MongoDB to Firebase Realtime DB / Firestore"""
    from app.services.firebase_service import sync_all_directory_to_firebase
    db = get_db()
    users_check = db["users"].count_documents({})
    if users_check <= 1:
        run_seed()

    res = sync_all_directory_to_firebase(db)
    return {
        "success": True,
        "message": f"Successfully synced {res['total']} records (Students: {res['students']}, Staff: {res['staff']}, Parents: {res['parents']}) to Firebase!",
        "stats": res
    }

