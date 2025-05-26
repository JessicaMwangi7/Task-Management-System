from datetime import datetime
from extensions import db

class Project(db.Model):
    __tablename__ = "project"
    id          = db.Column(db.Integer, primary_key=True)
    name        = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    owner_id    = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    owner        = db.relationship("User",      back_populates="projects")
    tasks        = db.relationship("Task",      back_populates="project", cascade="all, delete-orphan")
    collaborators= db.relationship("Collaborator", back_populates="project", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "owner_id": self.owner_id,
            "created_at": self.created_at.isoformat(),
            # add tasks
            "tasks": [task.serialize() for task in self.tasks],
            # add collaborators
            "collaborators": [collab.serialize() for collab in self.collaborators]
        }
