import os
from dotenv import load_dotenv

# Load .env in project root
load_dotenv()

# Ensure instance folder exists for SQLite
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
os.makedirs(INSTANCE_DIR, exist_ok=True)

class Config:
    SECRET_KEY                    = os.getenv("SECRET_KEY", "super-secret-key")
    SQLALCHEMY_DATABASE_URI       = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(INSTANCE_DIR, 'taskflow.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY                = os.getenv("JWT_SECRET_KEY", "jwt-super-secret")
    JWT_ACCESS_TOKEN_EXPIRES      = False

    # CORS_ORIGINS = os.getenv("CORS_ORIGINS", "https://task-management-system-sigma-lovat.vercel.app").split(",")
    CORS_ORIGINS                  = os.getenv("CORS_ORIGINS", "http://localhost:5173")
