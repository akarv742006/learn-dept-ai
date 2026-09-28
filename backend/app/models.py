from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any, Dict, Union

# User & Auth Schemas
class UserRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = Field(..., description="student, teacher, parent, or admin")
    college: Optional[str] = "Anna University"
    department: Optional[str] = "Computer Science"
    year: Optional[str] = "3rd Year"
    phone: Optional[str] = None
    linkedStudentId: Optional[str] = None
    parentName: Optional[str] = None
    parentPhone: Optional[str] = None
    parentPin: Optional[str] = "1234"

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    college: Optional[str] = "Anna University"
    department: Optional[str] = None
    year: Optional[str] = None
    avatar: Optional[str] = None
    linkedStudentId: Optional[str] = None
    parentName: Optional[str] = None
    parentPhone: Optional[str] = None
    parentId: Optional[str] = None
    token: Optional[str] = None
    is_premium: Optional[bool] = False
    plan: Optional[str] = "FREE"

# Assessment Schemas
class AssessmentGenerateRequest(BaseModel):
    studentId: str = "student_arun"
    subjectId: Optional[str] = "General"
    conceptId: Optional[str] = "All"
    difficulty: Optional[str] = "Medium"
    questionCount: Optional[int] = 5
    assessmentType: Optional[str] = "Practice Quiz"
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

# SaaS & Subscription Upgrade Schemas
class DemoSubscriptionActivateRequest(BaseModel):
    organizationId: str = "org_psr_eng"
    planId: str = "institution_pro"
    userId: Optional[str] = "admin_user"
    userRole: Optional[str] = "admin"
    adminName: Optional[str] = "Admin Officer"

class OrganizationMemberAddRequest(BaseModel):
    name: str
    email: EmailStr
    role: str = "student"  # student, teacher, admin
    department: Optional[str] = "Computer Science"
    userId: Optional[str] = None

# Free Demo UPI Payment Schemas
class DemoPaymentCreateRequest(BaseModel):
    plan_id: Optional[str] = "student_pro"
    planId: Optional[str] = None
    amount: Optional[int] = 99
    currency: Optional[str] = "INR"
    payment_method: Optional[str] = "DEMO_UPI"
    user_id: Optional[str] = None
    upi_id: Optional[str] = "akashkrishnamoorthi89@oksbi"

class DemoPaymentConfirmRequest(BaseModel):
    payment_id: Optional[str] = None
    paymentId: Optional[str] = None
    user_id: Optional[str] = None
    utr_number: Optional[str] = None
    utrNumber: Optional[str] = None
    screenshot_url: Optional[str] = None
    screenshotUrl: Optional[str] = None

