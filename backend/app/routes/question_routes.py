import time
import hashlib
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from app.database import get_db
from app.models import StaffQuestionCreateRequest, StaffAIQuestionGenRequest, BatchQuestionsCreateRequest

router = APIRouter(prefix="/api/questions", tags=["Question Bank"])

DEPARTMENTS = [
    "Computer Science",
    "Information Technology",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering"
]

@router.get("/departments")
def get_departments():
    return {
        "departments": DEPARTMENTS
    }

@router.get("")
def list_questions(
    department: Optional[str] = None,
    subject: Optional[str] = None,
    concept: Optional[str] = None,
    difficulty: Optional[str] = None
):
    db = get_db()
    query = {}
    if department and department != "All":
        query["$or"] = [
            {"department": {"$regex": department, "$options": "i"}},
            {"department": "All"},
            {"department": None}
        ]
    if subject and subject != "All":
        query["subjectId"] = {"$regex": subject, "$options": "i"}
    if concept and concept != "All":
        query["conceptId"] = {"$regex": concept, "$options": "i"}
    if difficulty and difficulty != "All":
        query["difficulty"] = {"$regex": difficulty, "$options": "i"}

    items = list(db["questions"].find(query).sort("createdAt", -1))
    for item in items:
        if "_id" in item:
            item["_id"] = str(item["_id"])
    return items

@router.post("/create")
def create_staff_question(req: StaffQuestionCreateRequest):
    db = get_db()
    
    # Generate stable fingerprint
    norm_text = req.question.strip().lower()
    fingerprint = hashlib.sha256(norm_text.encode("utf-8")).hexdigest()
    
    # Check duplicate
    existing = db["questions"].find_one({"fingerprint": fingerprint})
    if existing:
        raise HTTPException(status_code=400, detail="A question with identical wording already exists in the question bank.")
    
    q_id = f"q_staff_{int(time.time() * 1000)}"
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    
    doc = {
        "_id": q_id,
        "question": req.question.strip(),
        "options": req.options,
        "correctAnswer": req.correctAnswer,
        "explanation": req.explanation.strip() if req.explanation else "Explanation provided by Course Instructor.",
        "department": req.department,
        "subjectId": req.subjectId,
        "conceptId": req.conceptId,
        "difficulty": req.difficulty.lower(),
        "bloomLevel": req.bloomLevel or "Understand",
        "questionType": "multiple_choice",
        "source": "staff_created",
        "createdBy": req.createdBy or "Staff Instructor",
        "fingerprint": fingerprint,
        "tags": req.tags or [req.department, req.subjectId],
        "createdAt": now
    }
    
    db["questions"].insert_one(doc)
    return {
        "success": True,
        "questionId": q_id,
        "message": f"Question created successfully for department: {req.department} ({req.subjectId})",
        "question": doc
    }

@router.get("/cohort-weaknesses")
def get_department_cohort_weaknesses(department: Optional[str] = "Computer Science"):
    from app.services.ai_service import get_cohort_weaknesses
    weaknesses = get_cohort_weaknesses(department or "Computer Science")
    return {
        "department": department,
        "weaknesses": weaknesses
    }

@router.post("/ai-generate-from-weakness")
def ai_generate_from_weakness(req: StaffAIQuestionGenRequest):
    from app.services.ai_service import generate_weakness_remediation_questions
    result = generate_weakness_remediation_questions(
        department=req.department,
        subject_id=req.subjectId,
        concept_id=req.conceptId or "General",
        weakness_text=req.weaknessText or f"Diagnostic testing in {req.subjectId}",
        difficulty=req.difficulty or "medium",
        bloom_level=req.bloomLevel or "Apply",
        count=req.count or 3,
        save_directly=req.saveDirectly or False,
        created_by=req.createdBy or "Faculty AI Generator"
    )
    return result

@router.post("/batch-create")
def batch_create_questions(req: BatchQuestionsCreateRequest):
    db = get_db()
    inserted_docs = []
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    for q in req.questions:
        norm_text = q.question.strip().lower()
        fingerprint = hashlib.sha256(norm_text.encode("utf-8")).hexdigest()
        
        # Check duplicate
        if db["questions"].find_one({"fingerprint": fingerprint}):
            continue

        q_id = f"q_staff_{int(time.time() * 1000)}_{len(inserted_docs)}"
        doc = {
            "_id": q_id,
            "question": q.question.strip(),
            "options": q.options,
            "correctAnswer": q.correctAnswer,
            "explanation": q.explanation.strip() if q.explanation else "Explanation provided by Course Instructor.",
            "department": q.department,
            "subjectId": q.subjectId,
            "conceptId": q.conceptId,
            "difficulty": q.difficulty.lower(),
            "bloomLevel": q.bloomLevel or "Understand",
            "questionType": "multiple_choice",
            "source": "ai_staff_accepted",
            "createdBy": q.createdBy or "Staff Instructor",
            "fingerprint": fingerprint,
            "tags": q.tags or [q.department, q.subjectId],
            "createdAt": now
        }
        db["questions"].insert_one(doc)
        inserted_docs.append(doc)

    return {
        "success": True,
        "count": len(inserted_docs),
        "message": f"Successfully saved {len(inserted_docs)} questions into the Question Bank.",
        "questions": inserted_docs
    }

@router.delete("/{question_id}")
def delete_question(question_id: str):
    db = get_db()
    res = db["questions"].delete_one({"$or": [{"_id": question_id}, {"id": question_id}]})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Question not found")
    return {"success": True, "message": "Question deleted from Question Bank."}

