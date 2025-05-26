from datetime import datetime
from extensions import db

class Collaborator(db.Model):
    __tablename__ = 'collaborator'
    id         = db.Column(db.Integer,   primary_key=True)
    user_id    = db.Column(db.Integer,   db.ForeignKey('user.id'),    nullable=False)
    project_id = db.Column(db.Integer,   db.ForeignKey('project.id'), nullable=False)
    role       = db.Column(db.String(50), default='member')
    created_at = db.Column(db.DateTime,  default=datetime.utcnow)

    user    = db.relationship('User',    back_populates='collaborators')
    project = db.relationship('Project', back_populates='collaborators')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'project_id': self.project_id,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            # get user details if needed
            # get only the first name and last name
            'user': self.user.serialize() if self.user else None,
            'user': {
                'id': self.user.id,
                'first_name': self.user.first_name,
                'last_name': self.user.last_name
            } if self.user else None
            
            
        }
