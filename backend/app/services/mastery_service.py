import time
from typing import Dict, Any
from app.database import get_db

def update_concept_mastery(student_id: str, concept_id: str, is_correct: bool):
    db = get_db()
    existing = db["student_concepts"].find_one({"studentId": student_id, "conceptId": concept_id})

    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    if existing:
        current_score = existing.get("masteryScore", 70)
        attempted = existing.get("attemptedQuestions", 0) + 1
        correct = existing.get("correctAnswers", 0) + (1 if is_correct else 0)
        count = existing.get("assessmentCount", 1) + 1

        # Exponential moving average calculation: 70% previous, 30% current result (100 if correct else 0)
        target = 100 if is_correct else 0
        new_score = round(current_score * 0.7 + target * 0.3)

        trend = "improving" if new_score > current_score else ("declining" if new_score < current_score else "stable")

        db["student_concepts"].update_one(
            {"studentId": student_id, "conceptId": concept_id},
            {
                "$set": {
                    "masteryScore": new_score,
                    "attemptedQuestions": attempted,
                    "correctAnswers": correct,
                    "assessmentCount": count,
                    "lastScore": 100 if is_correct else 0,
                    "trend": trend,
                    "updatedAt": now
                }
            }
        )
        return new_score
    else:
        init_score = 100 if is_correct else 0
        doc = {
            "studentId": student_id,
            "conceptId": concept_id,
            "masteryScore": init_score,
            "attemptedQuestions": 1,
            "correctAnswers": 1 if is_correct else 0,
            "assessmentCount": 1,
            "lastScore": init_score,
            "trend": "new",
            "updatedAt": now
        }
        db["student_concepts"].insert_one(doc)
        return init_score
