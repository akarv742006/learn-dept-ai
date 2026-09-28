from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from app.database import get_db

router = APIRouter(prefix="/api/student", tags=["Student"])

@router.get("/dashboard")
def get_student_dashboard(student_id: str = "student_arun"):
    db = get_db()
    user = db["users"].find_one({"_id": student_id}) or db["users"].find_one({"role": "student"})
    if not user:
        # Fallback default
        user = {"name": "Arun Kumar", "email": "arun@student.edu", "role": "student", "department": "Computer Science", "year": "3rd Year"}

    sid = str(user.get("_id", student_id))

    # Fetch profile
    profile = db["students"].find_one({"userId": sid}) or {
        "rollNumber": "CS2023-042",
        "department": user.get("department", "Computer Science"),
        "year": user.get("year", "3rd Year"),
        "overallPerformance": 78,
        "learningDebt": 42,
        "riskLevel": "Medium"
    }

    # Fetch concept mastery
    mastery_docs = list(db["student_concepts"].find({"studentId": sid}))
    concept_mastery = {}
    for doc in mastery_docs:
        cid = doc.get("conceptId")
        if cid:
            concept_mastery[cid] = doc.get("masteryScore", 70)

    # Fetch recent assessments
    assessments = list(db["assessments"].find({"studentId": sid}).sort("createdAt", -1).limit(5))
    for a in assessments:
        a["_id"] = str(a["_id"])

    # Fetch debt history
    debt_history = list(db["learning_debt_history"].find({"studentId": sid}).sort("createdAt", 1).limit(10))
    for d in debt_history:
        d["_id"] = str(d["_id"])

    # Fetch notifications
    notifications = list(db["notifications"].find({"userId": sid}).sort("createdAt", -1).limit(5))
    for n in notifications:
        n["_id"] = str(n["_id"])

    return {
        "user": {
            "id": sid,
            "name": user.get("name"),
            "email": user.get("email"),
            "role": user.get("role"),
            "department": user.get("department"),
            "year": user.get("year"),
            "avatar": user.get("avatar")
        },
        "profile": profile,
        "overallPerformance": profile.get("overallPerformance", 78),
        "learningDebt": profile.get("learningDebt", 42),
        "riskLevel": profile.get("riskLevel", "Medium"),
        "conceptMastery": concept_mastery,
        "recentAssessments": assessments,
        "debtHistory": debt_history,
        "notifications": notifications
    }

@router.get("/analytics")
def get_student_analytics(student_id: str = "student_arun"):
    db = get_db()

    mastery_docs = list(db["student_concepts"].find({"studentId": student_id}))
    concept_scores = [{ "conceptId": doc.get("conceptId"), "masteryScore": doc.get("masteryScore"), "attempted": doc.get("attemptedQuestions") } for doc in mastery_docs]

    debt_history = list(db["learning_debt_history"].find({"studentId": student_id}).sort("createdAt", 1))
    for d in debt_history:
        d["_id"] = str(d["_id"])

    assessments = list(db["assessments"].find({"studentId": student_id}).sort("createdAt", -1))
    for a in assessments:
        a["_id"] = str(a["_id"])

    return {
        "conceptScores": concept_scores,
        "debtHistory": debt_history,
        "assessmentCount": len(assessments),
        "recentAssessments": assessments
    }
