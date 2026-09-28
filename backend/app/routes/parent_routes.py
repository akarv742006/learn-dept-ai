from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.database import get_db

router = APIRouter(prefix="/api/parent", tags=["Parent"])

@router.get("/dashboard")
def get_parent_dashboard(parent_id: str = "parent_sarah"):
    db = get_db()
    parent_user = db["users"].find_one({"_id": parent_id}) or db["users"].find_one({"role": "parent"})

    linked_student_id = parent_user.get("linkedStudentId", "student_arun") if parent_user else "student_arun"

    student_user = db["users"].find_one({"_id": linked_student_id}) or db["users"].find_one({"role": "student"})
    sid = str(student_user["_id"]) if student_user else linked_student_id

    student_profile = db["students"].find_one({"userId": sid}) or {
        "rollNumber": "CS2023-042",
        "department": "Computer Science",
        "year": "3rd Year",
        "overallPerformance": 78,
        "learningDebt": 42,
        "riskLevel": "Medium",
        "attendance": 92
    }

    mastery_docs = list(db["student_concepts"].find({"studentId": sid}))
    concept_mastery = {doc["conceptId"]: doc["masteryScore"] for doc in mastery_docs if "conceptId" in doc}

    recent_assessments = list(db["assessments"].find({"studentId": sid}).sort("createdAt", -1).limit(5))
    for a in recent_assessments:
        a["_id"] = str(a["_id"])

    debt_history = list(db["learning_debt_history"].find({"studentId": sid}).sort("createdAt", 1).limit(10))
    for d in debt_history:
        d["_id"] = str(d["_id"])

    notifications = list(db["notifications"].find({"userId": sid}).sort("createdAt", -1).limit(5))
    for n in notifications:
        n["_id"] = str(n["_id"])

    return {
        "parent": {
            "id": parent_user.get("_id") if parent_user else parent_id,
            "name": parent_user.get("name") if parent_user else "Sarah Jenkins",
            "email": parent_user.get("email") if parent_user else "sarah@parent.org"
        },
        "student": {
            "id": sid,
            "name": student_user.get("name") if student_user else "Arun Kumar",
            "department": student_profile.get("department"),
            "year": student_profile.get("year"),
            "overallPerformance": student_profile.get("overallPerformance"),
            "learningDebt": student_profile.get("learningDebt"),
            "riskLevel": student_profile.get("riskLevel"),
            "attendance": student_profile.get("attendance")
        },
        "conceptMastery": concept_mastery,
        "recentAssessments": recent_assessments,
        "debtHistory": debt_history,
        "notifications": notifications
    }
