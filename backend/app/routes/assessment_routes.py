import random
import time
import re
from typing import Optional
from fastapi import APIRouter, HTTPException
from app.models import AssessmentGenerateRequest, AssessmentSubmitRequest, StaffAssignmentCreateRequest
from app.database import get_db
from app.services.mastery_service import update_concept_mastery
from app.services.debt_service import calculate_learning_debt
from app.services.ai_service import generate_ai_questions

router = APIRouter(prefix="/api/assessments", tags=["Assessments"])

@router.post("/staff-create")
def staff_create_assignment(req: StaffAssignmentCreateRequest):
    db = get_db()
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    asm_id = f"assign_{int(time.time() * 1000)}"

    created_qids = list(req.questionIds or [])
    
    # If questions provided directly, insert them into questions collection
    if req.questions:
        import hashlib
        for q in req.questions:
            q_text = q.question.strip()
            fp = hashlib.sha256(q_text.lower().encode("utf-8")).hexdigest()
            existing = db["questions"].find_one({"fingerprint": fp})
            if existing:
                created_qids.append(str(existing.get("_id", existing.get("id"))))
            else:
                qid = f"q_staff_{int(time.time() * 1000)}_{len(created_qids)}"
                q_doc = {
                    "_id": qid,
                    "question": q_text,
                    "options": q.options,
                    "correctAnswer": q.correctAnswer,
                    "explanation": q.explanation or "Instructor verified question.",
                    "department": req.department,
                    "subjectId": req.subjectId,
                    "conceptId": q.conceptId or req.conceptId or "General",
                    "difficulty": q.difficulty.lower(),
                    "bloomLevel": q.bloomLevel or "Understand",
                    "source": "staff_assignment",
                    "createdBy": req.assignedBy or "Staff",
                    "fingerprint": fp,
                    "createdAt": now
                }
                db["questions"].insert_one(q_doc)
                created_qids.append(qid)

    # If no question IDs were provided, auto-link questions from question bank for this subject/department
    all_db_questions = list(db["questions"].find({}))
    if not created_qids:
        req_sub = str(req.subjectId or "").lower().strip()
        matched = [q for q in all_db_questions if str(q.get("subjectId", "")).lower().strip() == req_sub]
        if not matched:
            req_d = str(req.department or "").lower().strip()
            matched = [q for q in all_db_questions if req_d in str(q.get("department", "")).lower()]
        if not matched:
            matched = all_db_questions[:5]
        for m in matched[:5]:
            created_qids.append(str(m.get("_id", m.get("id"))))

    # Resolve full question objects to embed directly in the assignment document
    qid_set = set(str(x) for x in created_qids)
    embedded_questions = [q for q in all_db_questions if str(q.get("_id", q.get("id"))) in qid_set]
    if not embedded_questions:
        embedded_questions = all_db_questions[:5]

    # Persist the assignment doc in 'department_assignments' collection
    assignment_doc = {
        "_id": asm_id,
        "title": req.title,
        "description": req.description,
        "department": req.department,
        "targetYear": req.targetYear or "All Years",
        "subjectId": req.subjectId,
        "conceptId": req.conceptId or "All",
        "durationMinutes": req.durationMinutes or 30,
        "questionIds": created_qids,
        "questions": embedded_questions,
        "assignedBy": req.assignedBy or "Department Faculty",
        "dueDate": req.dueDate or "Next Week",
        "college": getattr(req, "college", "PSR Engineering College") or "PSR Engineering College",
        "institution": getattr(req, "institution", "PSR Engineering College") or "PSR Engineering College",
        "submissionsCount": 0,
        "averageScore": 0,
        "status": "published",
        "createdAt": now
    }
    db["department_assignments"].insert_one(assignment_doc)

    # Send Notification to Department Students
    notif = {
        "_id": f"notif_{int(time.time() * 1000)}",
        "targetRole": "student",
        "department": req.department,
        "title": f"New {req.department} Assignment: {req.title}",
        "message": f"{req.assignedBy or 'Faculty'} assigned {len(created_qids)} questions on {req.subjectId}. Due: {req.dueDate or 'Next Week'}.",
        "type": "Assignment",
        "assignmentId": asm_id,
        "isRead": False,
        "createdAt": now
    }
    db["notifications"].insert_one(notif)

    return {
        "success": True,
        "assignmentId": asm_id,
        "message": f"Assignment '{req.title}' successfully published to {req.department} students!",
        "assignment": assignment_doc
    }

@router.get("/department-assignments")
def get_department_assignments(department: Optional[str] = None):
    db = get_db()
    all_assignments = list(db["department_assignments"].find({}).sort("createdAt", -1))
    
    # If a specific department is passed (and not "all"), filter while always including campus-wide/all tests
    if department and department.lower() != "all" and "all departments" not in department.lower():
        req_d = department.lower().strip()
        filtered = []
        for a in all_assignments:
            dept = str(a.get("department", "")).lower().strip()
            # Include if matching requested department OR if published campus-wide
            if not dept or dept == "all" or "all" in dept or "campus" in dept or req_d in dept or dept in req_d:
                filtered.append(a)
        all_assignments = filtered

    for a in all_assignments:
        a["_id"] = str(a.get("_id"))
    return all_assignments

def shuffle_options_remap(question: dict) -> dict:
    original_options = list(question.get("options", []))
    correct_idx = question.get("correctAnswer", 0)
    correct_text = original_options[correct_idx] if 0 <= correct_idx < len(original_options) else (original_options[0] if original_options else "Correct")

    shuffled = list(original_options)
    random.shuffle(shuffled)
    new_correct_idx = shuffled.index(correct_text) if correct_text in shuffled else 0

    return {
        "id": str(question.get("_id", question.get("id"))),
        "question": question.get("question"),
        "options": shuffled,
        "correctAnswer": new_correct_idx,
        "explanation": question.get("explanation"),
        "department": question.get("department", "Computer Science"),
        "subjectId": question.get("subjectId", question.get("subject", "General")),
        "conceptId": question.get("conceptId", question.get("concept", "General")),
        "difficulty": question.get("difficulty", "medium")
    }

@router.post("/generate")
def generate_assessment(req: AssessmentGenerateRequest):
    db = get_db()
    student_id = req.studentId or "student_arun"

    # If assignmentId specified, load the exact staff-created questions for this assignment
    if req.assignmentId:
        assign_doc = db["department_assignments"].find_one({"$or": [{"_id": req.assignmentId}, {"id": req.assignmentId}]})
        if assign_doc:
            candidate_pool = []
            
            # 1. Use embedded questions if present
            if assign_doc.get("questions") and len(assign_doc["questions"]) > 0:
                candidate_pool = list(assign_doc["questions"])
            
            # 2. Or query from questions collection by questionIds
            if not candidate_pool and assign_doc.get("questionIds"):
                qids = [str(x) for x in assign_doc["questionIds"]]
                all_q = list(db["questions"].find({}))
                candidate_pool = [q for q in all_q if str(q.get("_id", q.get("id"))) in qids]
            
            # 3. Fallback: match by subject/department so student is NEVER shown 0 questions
            if not candidate_pool:
                all_q = list(db["questions"].find({}))
                target_sub = str(assign_doc.get("subjectId", "")).lower().strip()
                candidate_pool = [q for q in all_q if str(q.get("subjectId", "")).lower().strip() == target_sub]
                if not candidate_pool:
                    candidate_pool = all_q[:5]

            if candidate_pool:
                processed_questions = [shuffle_options_remap(q) for q in candidate_pool]
                assessment_id = f"asm_{int(time.time()*1000)}"
                now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                assessment_doc = {
                    "_id": assessment_id,
                    "studentId": student_id,
                    "assignmentId": req.assignmentId,
                    "subjectId": assign_doc.get("subjectId", req.subjectId),
                    "conceptId": assign_doc.get("conceptId", req.conceptId),
                    "department": assign_doc.get("department", req.department),
                    "type": "Staff Department Assignment",
                    "questionIds": [q["id"] for q in processed_questions],
                    "questions": processed_questions,
                    "status": "started",
                    "startedAt": now,
                    "submittedAt": None,
                    "totalQuestions": len(processed_questions),
                    "score": 0,
                    "percentage": 0,
                    "timeTaken": 0,
                    "createdAt": now
                }
                db["assessments"].insert_one(assessment_doc)
                return {
                    "assessmentId": assessment_id,
                    "questions": processed_questions,
                    "totalQuestions": len(processed_questions),
                    "unseenQuestionsRemaining": 0,
                    "exhausted": False,
                    "message": f"Loaded staff-created assignment: {assign_doc.get('title')}"
                }

    # 1. Identify previously attempted question IDs for this student
    attempts = list(db["question_attempts"].find({"$or": [{"studentId": student_id}, {"userId": student_id}]}))
    attempted_qids = set(str(a.get("questionId")) for a in attempts if a.get("questionId"))

    # 2. Query all questions matching subject, concept, and department
    all_questions = list(db["questions"].find({}))

    def matches_criteria(q: dict) -> bool:
        q_dept = str(q.get("department", "")).lower()
        q_subj = str(q.get("subjectId", q.get("subject", ""))).lower()
        q_conc = str(q.get("conceptId", q.get("concept", ""))).lower()

        req_dept = str(req.department or "").lower()
        req_subj = str(req.subjectId or "").lower()
        req_conc = str(req.conceptId or "").lower()

        dept_match = not req_dept or req_dept == "all" or not q_dept or (req_dept in q_dept or q_dept in req_dept)
        subj_match = not req_subj or req_subj == "all" or (req_subj in q_subj or q_subj in req_subj)
        conc_match = not req_conc or req_conc == "all" or (req_conc in q_conc or q_conc in req_conc)

        return dept_match and subj_match and conc_match

    all_eligible = [q for q in all_questions if matches_criteria(q)]

    # Filter out previously attempted questions
    unseen_questions = [q for q in all_eligible if str(q.get("_id", q.get("id"))) not in attempted_qids]

    # 3. If unseen questions are fewer than requested, generate fresh unique AI questions
    if len(unseen_questions) < req.questionCount:
        needed = req.questionCount - len(unseen_questions)
        ai_res = generate_ai_questions(
            subject_id=req.subjectId,
            concept_id=req.conceptId or "general",
            difficulty=req.difficulty or "medium",
            count=needed,
            excluded_fingerprints=[],
            student_id=student_id
        )
        # Re-fetch eligible unseen questions from MongoDB
        all_questions_after_ai = list(db["questions"].find({}))
        all_eligible = [q for q in all_questions_after_ai if matches_criteria(q)]
        unseen_questions = [q for q in all_eligible if str(q.get("_id", q.get("id"))) not in attempted_qids]

    exhausted = False
    if not unseen_questions:
        exhausted = True
        candidate_pool = list(all_eligible)
    else:
        candidate_pool = list(unseen_questions)

    if not candidate_pool:
        # Emergency question generator if pool is still empty
        q_idx = int(time.time()*1000)
        emergency_q = {
            "_id": f"q_auto_{q_idx}",
            "question": f"Diagnostic Probe Question on {req.conceptId or req.subjectId} (Variant #{q_idx % 1000})?",
            "options": [
                f"Core analytical property of {req.conceptId or req.subjectId}",
                "Secondary relational attribute",
                "Intermediate distractor",
                "Non-applicable condition"
            ],
            "correctAnswer": 0,
            "explanation": f"Diagnostic probe evaluating core comprehension of {req.conceptId or req.subjectId}.",
            "subjectId": req.subjectId,
            "conceptId": req.conceptId or "general",
            "difficulty": req.difficulty,
            "questionType": "multiple_choice",
            "source": "auto_generator",
            "fingerprint": f"fp_{q_idx}",
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        db["questions"].insert_one(emergency_q)
        candidate_pool = [emergency_q]

    # Randomly select questions up to requested count
    random.shuffle(candidate_pool)
    selected = candidate_pool[:req.questionCount]

    # Process and shuffle options with stable remapping of correct answer index
    processed_questions = [shuffle_options_remap(q) for q in selected]
    selected_qids = [q["id"] for q in processed_questions]

    assessment_id = f"asm_{int(time.time()*1000)}"
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    assessment_doc = {
        "_id": assessment_id,
        "studentId": student_id,
        "assignmentId": getattr(req, "assignmentId", None),
        "assignmentTitle": f"{req.subjectId} Assessment",
        "department": getattr(req, "department", None) or "Computer Science",
        "subjectId": req.subjectId,
        "conceptId": req.conceptId,
        "type": req.assessmentType,
        "questionIds": selected_qids,
        "questions": processed_questions,  # store snapshot with remapped answers
        "status": "started",
        "startedAt": now,
        "submittedAt": None,
        "totalQuestions": len(processed_questions),
        "attemptedQuestions": 0,
        "correctAnswers": 0,
        "score": 0,
        "percentage": 0,
        "timeTaken": 0,
        "createdAt": now
    }

    db["assessments"].insert_one(assessment_doc)

    unseen_remaining = max(0, len(unseen_questions) - len(selected))

    return {
        "assessmentId": assessment_id,
        "questions": processed_questions,
        "totalQuestions": len(processed_questions),
        "unseenQuestionsRemaining": unseen_remaining,
        "exhausted": exhausted,
        "message": "All available questions for this topic have been attempted." if exhausted else None
    }

@router.post("/{assessment_id}/submit")
def submit_assessment(assessment_id: str, req: AssessmentSubmitRequest):
    db = get_db()
    assessment = db["assessments"].find_one({"_id": assessment_id})

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    if assessment.get("status") == "submitted":
        return {
            "alreadySubmitted": True,
            "assessmentId": assessment_id,
            "score": assessment.get("score"),
            "maxScore": assessment.get("maxScore", (assessment.get("totalQuestions") or 1) * 10),
            "percentage": assessment.get("percentage"),
            "correctAnswers": assessment.get("correctAnswers"),
            "totalQuestions": assessment.get("totalQuestions"),
            "passed": assessment.get("percentage", 0) >= 50.0,
            "review": assessment.get("review", [])
        }

    questions = assessment.get("questions", [])
    q_map = {q["id"]: q for q in questions}

    correct_count = 0
    attempt_docs = []
    review_items = []
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    student_id = assessment.get("studentId", "student_arun")

    for ans in req.answers:
        qid = ans.questionId
        selected = ans.selectedAnswer
        q_obj = q_map.get(qid)
        if not q_obj:
            continue

        correct_idx = q_obj.get("correctAnswer", 0)
        options = list(q_obj.get("options", []))
        correct_text = options[correct_idx] if (isinstance(correct_idx, int) and 0 <= correct_idx < len(options)) else None

        is_correct = False
        if selected == correct_idx or str(selected) == str(correct_idx):
            is_correct = True
        elif correct_text and str(selected).strip().lower() == str(correct_text).strip().lower():
            is_correct = True

        if is_correct:
            correct_count += 1

        selected_text = options[selected] if (isinstance(selected, int) and 0 <= selected < len(options)) else str(selected)
        concept_id = q_obj.get("conceptId", "general")
        update_concept_mastery(student_id, concept_id, is_correct)

        attempt_docs.append({
            "_id": f"att_{int(time.time()*1000)}_{len(attempt_docs)}",
            "studentId": student_id,
            "userId": student_id,
            "questionId": qid,
            "assessmentId": assessment_id,
            "subjectId": q_obj.get("subjectId"),
            "conceptId": concept_id,
            "selectedAnswer": selected,
            "correct": is_correct,
            "score": 10 if is_correct else 0,
            "attemptedAt": now
        })

        review_items.append({
            "questionId": qid,
            "question": q_obj.get("question"),
            "options": options,
            "selectedAnswer": selected,
            "selectedAnswerText": selected_text,
            "correctAnswer": correct_idx,
            "correctAnswerText": correct_text,
            "isCorrect": is_correct,
            "marks": 10 if is_correct else 0,
            "explanation": q_obj.get("explanation") or "Review core textbook principles for full rationale.",
            "conceptId": concept_id,
            "subjectId": q_obj.get("subjectId")
        })

    total_q = len(questions) or 1
    percentage = round((correct_count / total_q) * 100, 1)
    total_score = correct_count * 10
    max_score = total_q * 10
    passed = percentage >= 50.0

    # Save question attempts to database
    if attempt_docs:
        db["question_attempts"].insert_many(attempt_docs)

    # Recalculate Learning Debt
    debt_res = calculate_learning_debt(student_id, assessment_id)

    # Lookup student profile for gradebook record
    student_user = db["users"].find_one({"$or": [{"_id": student_id}, {"id": student_id}]}) or {}
    student_name = student_user.get("name") or "Arun Kumar"
    student_email = student_user.get("email") or f"{student_id}@student.edu"
    student_dept = assessment.get("department") or student_user.get("department") or "Computer Science"
    student_year = student_user.get("year") or "Year 3"
    time_taken_val = getattr(req, 'timeTaken', 120) or 120

    # Record complete gradebook submission for staff review
    submission_id = f"sub_{int(time.time()*1000)}"
    submission_doc = {
        "_id": submission_id,
        "assessmentId": assessment_id,
        "assignmentId": assessment.get("assignmentId"),
        "assignmentTitle": assessment.get("assignmentTitle") or f"{assessment.get('subjectId', 'Subject')} Assessment",
        "studentId": student_id,
        "studentName": student_name,
        "studentEmail": student_email,
        "department": student_dept,
        "year": student_year,
        "score": total_score,
        "maxScore": max_score,
        "percentage": percentage,
        "correctAnswers": correct_count,
        "totalQuestions": total_q,
        "passed": passed,
        "timeTaken": time_taken_val,
        "submittedAt": now,
        "review": review_items
    }
    db["assignment_submissions"].insert_one(submission_doc)

    # If linked to a department assignment, update live stats on assignment
    if assessment.get("assignmentId"):
        aid = assessment.get("assignmentId")
        all_subs = list(db["assignment_submissions"].find({"assignmentId": aid}))
        if all_subs:
            avg_sc = round(sum(s.get("percentage", 0) for s in all_subs) / len(all_subs), 1)
            db["department_assignments"].update_one(
                {"_id": aid},
                {"$set": {"submissionsCount": len(all_subs), "averageScore": avg_sc}}
            )

    # Update assessment record
    db["assessments"].update_one(
        {"_id": assessment_id},
        {
            "$set": {
                "status": "submitted",
                "submittedAt": now,
                "attemptedQuestions": len(req.answers),
                "correctAnswers": correct_count,
                "score": total_score,
                "maxScore": max_score,
                "percentage": percentage,
                "passed": passed,
                "timeTaken": time_taken_val,
                "review": review_items
            }
        }
    )

    # Create Evaluation Notifications
    notif_doc = {
        "_id": f"notif_{int(time.time()*1000)}",
        "userId": student_id,
        "type": "assessment",
        "title": f"Exam Evaluated: {total_score}/{max_score} Marks ({percentage}%)",
        "message": f"Completed {assessment.get('subjectId', 'Subject')} exam. Result: {'PASSED' if passed else 'NEEDS REMEDIATION'}. Correct: {correct_count}/{total_q}.",
        "read": False,
        "relatedEntityId": assessment_id,
        "createdAt": now
    }
    db["notifications"].insert_one(notif_doc)

    return {
        "assessmentId": assessment_id,
        "status": "submitted",
        "score": total_score,
        "maxScore": max_score,
        "percentage": percentage,
        "correctAnswers": correct_count,
        "totalQuestions": total_q,
        "passed": passed,
        "timeTaken": time_taken_val,
        "learningDebt": debt_res["learningDebt"],
        "riskLevel": debt_res["riskLevel"],
        "review": review_items,
        "notification": notif_doc
    }

@router.get("/submissions")
def get_student_submissions(
    assignmentId: Optional[str] = None,
    department: Optional[str] = None,
    studentId: Optional[str] = None
):
    db = get_db()
    all_subs = list(db["assignment_submissions"].find({}).sort("submittedAt", -1))

    filtered = []
    for s in all_subs:
        s["_id"] = str(s.get("_id"))
        if studentId and str(s.get("studentId")) != str(studentId):
            continue
        if assignmentId and str(s.get("assignmentId")) != str(assignmentId):
            continue
        if department and department.lower() != "all":
            s_dept = str(s.get("department", "")).lower()
            if department.lower() not in s_dept and s_dept not in department.lower():
                continue
        filtered.append(s)

    return filtered

@router.get("/{assessment_id}/review")
def get_assessment_review(assessment_id: str):
    db = get_db()
    sub = db["assignment_submissions"].find_one({"$or": [{"assessmentId": assessment_id}, {"_id": assessment_id}]})
    if sub:
        sub["_id"] = str(sub.get("_id"))
        return sub

    asm = db["assessments"].find_one({"_id": assessment_id})
    if not asm:
        raise HTTPException(status_code=404, detail="Assessment not found")

    asm["_id"] = str(asm.get("_id"))
    return asm

