import time
import uuid
from typing import Dict, Any, List
from app.database import get_db

def calculate_learning_debt(student_id: str, assessment_id: str = None) -> Dict[str, Any]:
    db = get_db()
    concepts = list(db["student_concepts"].find({"studentId": student_id}))

    if not concepts:
        total_debt = 40
        risk_level = "Medium"
        root_concept = "c_fd"
        reasons = ["Initial diagnostic baseline"]
        affected = ["c_fd", "c_norm"]
    else:
        # Calculate learning debt based on concept deficits below 75%
        deficits = []
        for c in concepts:
            m = c.get("masteryScore", 70)
            if m < 75:
                deficits.append((c.get("conceptId"), 75 - m))

        if not deficits:
            total_debt = 12
            risk_level = "Low"
            root_concept = None
            reasons = ["Student demonstrates strong concept mastery across all subjects."]
            affected = []
        else:
            deficits.sort(key=lambda x: x[1], reverse=True)
            root_concept = deficits[0][0]
            total_gap_points = sum(d[1] for d in deficits)
            total_debt = min(95, max(15, int(total_gap_points * 1.5)))

            if total_debt >= 65:
                risk_level = "High"
            elif total_debt >= 35:
                risk_level = "Medium"
            else:
                risk_level = "Low"

            affected = [d[0] for d in deficits]
            reasons = [f"Foundational gap identified in {root_concept}. Impairing downstream comprehension."]

    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    record = {
        "_id": f"ldh_{uuid.uuid4().hex[:10]}",
        "studentId": student_id,
        "score": total_debt,
        "riskLevel": risk_level,
        "rootConceptId": root_concept,
        "affectedConceptIds": affected,
        "reasons": reasons,
        "sourceAssessmentId": assessment_id,
        "createdAt": now
    }

    db["learning_debt_history"].insert_one(record)

    # Update student profile overall learning debt and risk level
    db["students"].update_one(
        {"userId": student_id},
        {"$set": {"learningDebt": total_debt, "riskLevel": risk_level, "updatedAt": now}}
    )

    return {
        "learningDebt": total_debt,
        "riskLevel": risk_level,
        "rootConceptId": root_concept,
        "affectedConceptIds": affected,
        "reasons": reasons
    }
