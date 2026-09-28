from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth_routes import router as auth_router
from app.routes.question_routes import router as question_router
from app.routes.assessment_routes import router as assessment_router
from app.routes.student_routes import router as student_router
from app.routes.teacher_routes import router as teacher_router
from app.routes.parent_routes import router as parent_router
from app.routes.admin_routes import router as admin_router
from app.routes.subscription_routes import router as subscription_router
from app.routes.ai_routes import router as ai_router
from app.database import get_db

app = FastAPI(
    title="LearnDebt AI Backend API",
    description="Centralized FastAPI backend for LearnDebt AI using MongoDB Atlas as single source of truth.",
    version="1.0.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(auth_router)
app.include_router(question_router)
app.include_router(assessment_router)
app.include_router(student_router)
app.include_router(teacher_router)
app.include_router(parent_router)
app.include_router(admin_router)
app.include_router(subscription_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "LearnDebt AI FastAPI Backend",
        "docs": "/docs"
    }

@app.on_event("startup")
def startup_event():
    print("[INIT] FastAPI Backend starting up...")
    db = get_db()
    print(f"[INIT] Database connected successfully: {db}")
    if db["users"].count_documents({}) == 0:
        print("[INIT] Database users empty. Auto-seeding initial users and academic datasets...")
        try:
            from scripts.seed import seed_database
            seed_database()
        except Exception as e:
            print(f"[INIT] Error running seed: {e}")
    from app.services.saas_service import init_saas_data
    init_saas_data()
    print("[INIT] SaaS Plans, Organizations and Seat Quotas initialized.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
