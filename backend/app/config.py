import os
import re
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in backend directory, then parent directory (project root)
current_dir = Path(__file__).resolve().parent  # app/
backend_dir = current_dir.parent               # backend/
root_dir = backend_dir.parent                  # project root

# Load from backend/.env first if present, then fallback to root .env
backend_env = backend_dir / ".env"
root_env = root_dir / ".env"

if backend_env.exists():
    load_dotenv(dotenv_path=backend_env, override=True)
elif root_env.exists():
    load_dotenv(dotenv_path=root_env, override=True)
else:
    load_dotenv(override=True)

class Settings:
    PROJECT_NAME: str = "LearnDebt AI Backend"
    
    # MongoDB Atlas Connectivity
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    MONGODB_DATABASE: str = os.getenv("MONGODB_DATABASE", "learndebt")
    
    # AI & Gemini Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
    
    # Payment & Demo Mode
    DEMO_PAYMENT_MODE: bool = os.getenv("DEMO_PAYMENT_MODE", "true").lower() == "true"
    
    # Authentication & Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "learndebt_super_secret_jwt_key_2026")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    def reload(self):
        """Reload environment variables from .env files"""
        if backend_env.exists():
            load_dotenv(dotenv_path=backend_env, override=True)
        elif root_env.exists():
            load_dotenv(dotenv_path=root_env, override=True)
        self.MONGODB_URI = os.getenv("MONGODB_URI", "")
        self.MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", "learndebt")
        self.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
        self.GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    def get_masked_mongodb_uri(self) -> str:
        """Return MongoDB URI with password masked for safe display in UI/logs"""
        uri = self.MONGODB_URI or ""
        if not uri:
            return "mongodb://localhost:27017 (Local Default)"
        # Mask password between : and @
        masked = re.sub(r":([^@/]+)@", r":****@", uri)
        return masked

settings = Settings()
