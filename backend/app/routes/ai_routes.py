from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.models import AIQuestionGenRequest
from app.services.ai_service import generate_ai_questions, check_ai_health, chat_with_ai, get_student_lowest_concept
from app.config import settings

router = APIRouter(prefix="/api/ai", tags=["AI Integration"])

class AIChatRequest(BaseModel):
    message: str
    studentId: Optional[str] = "student_arun"

@router.get("/health")
def ai_health():
    health = check_ai_health()
    return health

@router.post("/chat")
def ai_chat(req: AIChatRequest):
    return chat_with_ai(req.message, req.studentId or "student_arun")

@router.post("/analyze-learning-gap")
def ai_analyze_learning_gap(req: Dict[str, Any]):
    student_id = req.get("studentId", "student_arun")
    lowest = get_student_lowest_concept(student_id)
    cname = lowest["conceptName"]
    score = lowest["masteryScore"]
    subject = lowest["subjectId"]

    return {
        "data": {
            "summary": f"Exam score conceals underlying foundational deficit in {cname} ({score}% mastery).",
            "detectedGaps": [cname, f"{cname} Prerequisite"],
            "rootCause": f"Struggling with core concepts of {cname} in {subject}.",
            "remediationSteps": [
                f"Review foundational principles of {cname}",
                f"Complete 5 diagnostic practice probes in {subject}",
                "Schedule a 15-minute educator review"
            ]
        }
    }

@router.post("/generate-questions")
def ai_generate_questions(req: AIQuestionGenRequest):
    result = generate_ai_questions(
        subject_id=req.subjectId,
        concept_id=req.conceptId,
        difficulty=req.difficulty,
        count=req.count,
        excluded_fingerprints=req.excludedFingerprints,
        student_id=req.studentId
    )
    return result
