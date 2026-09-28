import time
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, Header, Query
from app.models import UserRegisterRequest, UserLoginRequest, UserResponse
from app.auth import hash_password, verify_password, create_jwt_token, decode_jwt_token
from app.database import get_db
from app.services.firebase_service import sync_user_to_firebase

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(req: UserRegisterRequest):
    db = get_db()
    email = req.email.lower().strip()
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    college = (req.college or "Anna University").strip()

    # Check existing user in MongoDB
    if db["users"].find_one({"email": email}):
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed = hash_password(req.password)
    user_id = f"user-{int(time.time()*1000)}"

    parent_name = req.parentName.strip() if req.parentName else f"Parent of {req.name}"
    parent_phone = req.parentPhone.strip() if req.parentPhone else "+91 63797 62186"
    parent_id = f"parent_{user_id}"

    user_doc = {
        "_id": user_id,
        "name": req.name,
        "email": email,
        "passwordHash": hashed,
        "role": req.role.lower(),
        "college": college,
        "department": req.department,
        "year": req.year,
        "phone": req.phone or "+91 98450 11223",
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={req.name}",
        "linkedStudentId": req.linkedStudentId,
        "parentName": parent_name if req.role.lower() == "student" else None,
        "parentPhone": parent_phone if req.role.lower() == "student" else None,
        "parentId": parent_id if req.role.lower() == "student" else None,
        "createdAt": now,
        "updatedAt": now,
        "lastLoginAt": now
    }

    # If registering a student, create student profile & auto-generate linked parent login
    if req.role.lower() == "student":
        student_doc = {
            "userId": user_id,
            "rollNumber": f"AU-2026-{user_id[-4:]}",
            "college": college,
            "department": req.department,
            "year": req.year,
            "phone": req.phone or "+91 98450 11223",
            "parentName": parent_name,
            "parentPhone": parent_phone,
            "parentId": parent_id,
            "subjects": ["DBMS", "Data Structures", "Java", "Mathematics"],
            "overallPerformance": 78,
            "learningDebt": 42,
            "riskLevel": "Medium",
            "attendance": 92,
            "mentorName": "Dr. Rajesh Sharma",
            "mentorPhone": "+91 63797 62186",
            "createdAt": now,
            "updatedAt": now
        }
        db["students"].insert_one(student_doc)

        # Automatically create linked Parent login account
        parent_pin = req.parentPin or "1234"
        parent_email = f"{email.split('@')[0]}.parent@learndebt.ai"
        parent_doc = {
            "_id": parent_id,
            "name": parent_name,
            "email": parent_email,
            "phone": parent_phone,
            "pin": parent_pin,
            "passwordHash": hash_password(parent_pin),
            "role": "parent",
            "college": college,
            "linkedStudentId": user_id,
            "linkedStudentName": req.name,
            "childRollNo": student_doc["rollNumber"],
            "preferredLanguage": "ta",  # Tamil & English primary
            "relationship": "Parent / Guardian",
            "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={parent_name}",
            "createdAt": now,
            "updatedAt": now,
            "lastLoginAt": now
        }
        db["users"].insert_one(parent_doc)

        # Sync Parent to Firebase Realtime Database
        sync_user_to_firebase(parent_doc)

    db["users"].insert_one(user_doc)

    # Sync User to Firebase Realtime Database
    sync_user_to_firebase(user_doc)

    token = create_jwt_token(user_id, email, req.role.lower())

    return UserResponse(
        id=user_id,
        name=req.name,
        email=email,
        role=req.role.lower(),
        college=college,
        department=req.department,
        year=req.year,
        avatar=user_doc["avatar"],
        linkedStudentId=req.linkedStudentId,
        parentName=parent_name if req.role.lower() == "student" else None,
        parentPhone=parent_phone if req.role.lower() == "student" else None,
        parentId=parent_id if req.role.lower() == "student" else None,
        token=token
    )

@router.post("/login", response_model=UserResponse)
def login(req: UserLoginRequest):
    db = get_db()
    email = req.email.lower().strip()

    user_doc = db["users"].find_one({"email": email})

    if not user_doc or not verify_password(req.password, user_doc.get("passwordHash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user_doc.get("_id", user_doc.get("id")))
    token = create_jwt_token(user_id, email, user_doc["role"])

    # Check for active subscription
    sub = db["subscriptions"].find_one({"$or": [{"user_id": user_id}, {"userId": user_id}], "status": "active"})
    is_prem = bool(sub or user_doc.get("is_premium"))
    plan = sub.get("plan_id", "STUDENT_PRO") if sub else user_doc.get("plan", "FREE")

    # Linked student/parent resolution
    parent_name = user_doc.get("parentName")
    parent_phone = user_doc.get("parentPhone")
    parent_id = user_doc.get("parentId")
    if user_doc["role"] == "student" and not parent_name:
        s_rec = db["students"].find_one({"userId": user_id})
        if s_rec:
            parent_name = s_rec.get("parentName", "Ramesh Krishnan")
            parent_phone = s_rec.get("parentPhone", "+91 63797 62186")
            parent_id = s_rec.get("parentId", f"parent_{user_id}")

    return UserResponse(
        id=user_id,
        name=user_doc["name"],
        email=email,
        role=user_doc["role"],
        college=user_doc.get("college", "Anna University"),
        department=user_doc.get("department"),
        year=user_doc.get("year"),
        avatar=user_doc.get("avatar"),
        linkedStudentId=user_doc.get("linkedStudentId"),
        parentName=parent_name,
        parentPhone=parent_phone,
        parentId=parent_id,
        token=token,
        is_premium=is_prem,
        plan=plan
    )

@router.get("/me", response_model=UserResponse)
def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization token")

    token = authorization.split(" ")[1]
    decoded = decode_jwt_token(token)
    if not decoded:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = decoded["sub"]
    db = get_db()
    user_doc = db["users"].find_one({"_id": user_id})

    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")

    sub = db["subscriptions"].find_one({"$or": [{"user_id": user_id}, {"userId": user_id}], "status": "active"})
    is_prem = bool(sub or user_doc.get("is_premium"))
    plan = sub.get("plan_id", "STUDENT_PRO") if sub else user_doc.get("plan", "FREE")

    return UserResponse(
        id=user_id,
        name=user_doc["name"],
        email=user_doc["email"],
        role=user_doc["role"],
        college=user_doc.get("college", "Anna University"),
        department=user_doc.get("department"),
        year=user_doc.get("year"),
        avatar=user_doc.get("avatar"),
        linkedStudentId=user_doc.get("linkedStudentId"),
        parentName=user_doc.get("parentName"),
        parentPhone=user_doc.get("parentPhone"),
        parentId=user_doc.get("parentId"),
        token=token,
        is_premium=is_prem,
        plan=plan
    )

@router.get("/college-staff")
def get_college_staff(college: Optional[str] = Query("Anna University")):
    """
    Returns all faculty and staff belonging to the requested college so students
    can view, consult, and contact their own department professors.
    """
    db = get_db()
    target_college = college or "Anna University"
    
    # Query staff by college (case-insensitive regex)
    regex_pattern = {"$regex": f"^{target_college.strip()}", "$options": "i"}
    staff_docs = list(db["users"].find({
        "role": {"$in": ["teacher", "admin"]},
        "$or": [
            {"college": regex_pattern},
            {"institution": regex_pattern},
            {"college": {"$exists": False}}  # Fallback to default
        ]
    }))

    staff_list = []
    for s in staff_docs:
        uid = str(s.get("_id", s.get("id")))
        staff_list.append({
            "id": uid,
            "name": s.get("name"),
            "email": s.get("email"),
            "college": s.get("college", target_college),
            "department": s.get("department", "Computer Science"),
            "designation": s.get("designation", "Faculty Mentor & Associate Professor"),
            "phone": s.get("phone", "+91 63797 62186"),
            "whatsapp": "6379762186",
            "officeHours": "Mon-Fri 09:00 AM - 05:00 PM",
            "avatar": s.get("avatar", f"https://api.dicebear.com/7.x/avataaars/svg?seed={s.get('name')}"),
            "courses": ["Database Management Systems", "Data Structures & Algorithms", "Cloud Architecture"]
        })

    # Ensure at least Dr. Rajesh Sharma and Ms. Priya Sharma are returned
    if not staff_list:
        staff_list = [
            {
                "id": "teacher_rajesh",
                "name": "Dr. Rajesh Sharma",
                "email": "rajesh@teacher.edu",
                "college": target_college,
                "department": "Computer Science & Engineering",
                "designation": "Associate Professor & Head of Department",
                "phone": "+91 63797 62186",
                "whatsapp": "6379762186",
                "officeHours": "Mon-Fri 09:00 AM - 05:00 PM",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
                "courses": ["DBMS", "Distributed Systems"]
            },
            {
                "id": "teacher_priya_sharma",
                "name": "Ms. Priya Sharma",
                "email": "priya.sharma@learndebt.ai",
                "college": target_college,
                "department": "Computer Science & Engineering",
                "designation": "Assistant Professor & Concept Advisor",
                "phone": "+91 63797 62186",
                "whatsapp": "6379762186",
                "officeHours": "Mon-Thu 10:00 AM - 04:00 PM",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma",
                "courses": ["Relational Schema Design", "Normalization"]
            }
        ]

    return {
        "success": True,
        "college": target_college,
        "totalStaff": len(staff_list),
        "staff": staff_list
    }

@router.get("/college-students")
def get_college_students(college: Optional[str] = Query("Anna University")):
    """
    Returns all students belonging to the requested college so teachers/staff can inspect their students.
    """
    db = get_db()
    target_college = college or "Anna University"
    students = list(db["students"].find({}))
    users = {str(u.get("_id")): u for u in db["users"].find({"role": "student"})}

    result = []
    for s in students:
        uid = str(s.get("userId") or s.get("_id"))
        u_info = users.get(uid, {})
        s_college = s.get("college") or u_info.get("college") or "Anna University"
        if target_college.lower() in s_college.lower() or s_college.lower() in target_college.lower():
            result.append({
                "id": uid,
                "name": u_info.get("name", s.get("name", "Student")),
                "email": u_info.get("email"),
                "college": s_college,
                "rollNumber": s.get("rollNumber", "CS2026-001"),
                "department": s.get("department", "Computer Science"),
                "overallPerformance": s.get("overallPerformance", 78),
                "learningDebt": s.get("learningDebt", 42),
                "attendance": s.get("attendance", 92),
                "parentName": s.get("parentName", "Ramesh Krishnan"),
                "parentPhone": s.get("parentPhone", "+91 63797 62186")
            })

    return {
        "success": True,
        "college": target_college,
        "totalStudents": len(result),
        "students": result
    }
