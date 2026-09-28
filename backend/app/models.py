from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any, Dict, Union

# User & Auth Schemas
class UserRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = Field(..., description="student, teacher, parent, or admin")
    department: Optional[str] = "Computer Science"
    year: Optional[str] = "3rd Year"
    linkedStudentId: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: Optional[str] = None
    year: Optional[str] = None
    avatar: Optional[str] = None
    linkedStudentId: Optional[str] = None
    token: Optional[str] = None

# Assessment Schemas
class AssessmentGenerateRequest(BaseModel):
    studentId: str
    subjectId: str
    conceptId: Optional[str] = "All"
    difficulty: Optional[str] = "Medium"
    questionCount: int = 5
    assessmentType: str = "Practice Quiz"
    department: Optional[str] = "Computer Science"
    assignmentId: Optional[str] = None

class AnswerSubmissionItem(BaseModel):
    questionId: str
    selectedAnswer: Union[int, str, Any] = 0

class AssessmentSubmitRequest(BaseModel):
    answers: List[AnswerSubmissionItem]
    timeTaken: Optional[int] = 120

class StaffQuestionCreateRequest(BaseModel):
    question: str
    options: List[str]
    correctAnswer: int = 0
    explanation: Optional[str] = ""
    department: str = "Computer Science"
    subjectId: str = "DBMS"
    conceptId: str = "c_fd"
    difficulty: str = "medium"
    bloomLevel: Optional[str] = "Understand"
    createdBy: Optional[str] = "Staff"
    tags: Optional[List[str]] = []

class StaffAssignmentCreateRequest(BaseModel):
    title: str
    description: Optional[str] = ""
    department: str = "Computer Science"
    targetYear: Optional[str] = "3rd Year"
    subjectId: str = "DBMS"
    conceptId: Optional[str] = "All"
    durationMinutes: Optional[int] = 30
    questionIds: Optional[List[str]] = []
    questions: Optional[List[StaffQuestionCreateRequest]] = []
    assignedBy: Optional[str] = "Staff"
    dueDate: Optional[str] = None

# AI Question Generation Schema
class AIQuestionGenRequest(BaseModel):
    studentId: str
    subjectId: str
    conceptId: str
    difficulty: str = "Medium"
    count: int = 5
    excludedFingerprints: Optional[List[str]] = []

# Subscription Checkout Schema
class SubscriptionCheckoutRequest(BaseModel):
    userId: str
    planId: str
    billingPeriod: str = "Monthly"
    amount: float
    currency: Optional[str] = "INR"
    paymentProvider: str = "UPI / Demo"

class StaffAIQuestionGenRequest(BaseModel):
    department: str = "Computer Science"
    subjectId: str = "DBMS"
    conceptId: Optional[str] = "c_fd"
    weaknessText: Optional[str] = ""
    difficulty: Optional[str] = "medium"
    bloomLevel: Optional[str] = "Apply"
    count: Optional[int] = 3
    saveDirectly: Optional[bool] = False
    createdBy: Optional[str] = "Faculty AI Generator"

class BatchQuestionsCreateRequest(BaseModel):
    questions: List[StaffQuestionCreateRequest]

