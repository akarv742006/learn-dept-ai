import time
from fastapi import APIRouter, HTTPException, Depends, Header
from app.models import UserRegisterRequest, UserLoginRequest, UserResponse
from app.auth import hash_password, verify_password, create_jwt_token, decode_jwt_token
from app.database import get_db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(req: UserRegisterRequest):
    db = get_db()
    email = req.email.lower().strip()
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    # Check existing user in MongoDB
    if db["users"].find_one({"email": email}):
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed = hash_password(req.password)
    user_id = f"user-{int(time.time()*1000)}"

    user_doc = {
        "_id": user_id,
        "name": req.name,
        "email": email,
        "passwordHash": hashed,
        "role": req.role,
        "department": req.department,
        "year": req.year,
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={req.name}",
        "linkedStudentId": req.linkedStudentId,
        "createdAt": now,
        "updatedAt": now,
        "lastLoginAt": now
    }

    # If registering a student, create student profile in students collection
    if req.role.lower() == "student":
        student_doc = {
            "userId": user_id,
            "rollNumber": f"2026-{user_id[-4:]}",
            "department": req.department,
            "year": req.year,
            "subjects": ["DBMS", "Data Structures", "Java", "Mathematics"],
            "overallPerformance": 78,
            "learningDebt": 48,
            "riskLevel": "Medium",
            "attendance": 92,
            "createdAt": now,
            "updatedAt": now
        }
        db["students"].insert_one(student_doc)

    db["users"].insert_one(user_doc)
    token = create_jwt_token(user_id, email, req.role)

    return UserResponse(
        id=user_id,
        name=req.name,
        email=email,
        role=req.role,
        department=req.department,
        year=req.year,
        avatar=user_doc["avatar"],
        linkedStudentId=req.linkedStudentId,
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

    return UserResponse(
        id=user_id,
        name=user_doc["name"],
        email=email,
        role=user_doc["role"],
        department=user_doc.get("department"),
        year=user_doc.get("year"),
        avatar=user_doc.get("avatar"),
        linkedStudentId=user_doc.get("linkedStudentId"),
        token=token
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

    return UserResponse(
        id=user_id,
        name=user_doc["name"],
        email=user_doc["email"],
        role=user_doc["role"],
        department=user_doc.get("department"),
        year=user_doc.get("year"),
        avatar=user_doc.get("avatar"),
        linkedStudentId=user_doc.get("linkedStudentId"),
        token=token
    )
