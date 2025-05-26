from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db

class User(db.Model):
    __tablename__ = 'user'
    id                   = db.Column(db.Integer,   primary_key=True)
    first_name           = db.Column(db.String(150), nullable=False)
    last_name            = db.Column(db.String(150), nullable=False)
    email                = db.Column(db.String(150), unique=True, nullable=False)
    password_hash        = db.Column(db.String(256), nullable=False)
    role                 = db.Column(db.String(50), default="user", nullable=False)
    onboarding_completed = db.Column(db.Boolean, default=False, nullable=False)
    category             = db.Column(db.String(100), nullable=True)
    subcategory          = db.Column(db.String(100), nullable=True)
    created_at           = db.Column(db.DateTime, default=datetime.utcnow)

    projects     = db.relationship("Project",     back_populates="owner",       cascade="all, delete-orphan")
    tasks        = db.relationship("Task",        back_populates="assignee",    cascade="all, delete-orphan")
    comments     = db.relationship("Comment",     back_populates="author",      cascade="all, delete-orphan")
    collaborators= db.relationship("Collaborator", back_populates="user",       cascade="all, delete-orphan")
    notifications = db.relationship("Notification", back_populates="user", cascade="all, delete-orphan")

    def set_password(self, pw):
        self.password_hash = generate_password_hash(pw)

    def check_password(self, pw):
        return check_password_hash(self.password_hash, pw)

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "role": self.role,
            "onboarding_completed": self.onboarding_completed,
            "category": self.category,
            "subcategory": self.subcategory,
            "created_at": self.created_at.isoformat()
        }
