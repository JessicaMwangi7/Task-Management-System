from datetime import datetime
from extensions import db


class Newsletter(db.Model):
    __tablename__ = 'newsletter'
    
    id          = db.Column(db.Integer, primary_key=True)
    email       = db.Column(db.String(150), nullable=False, unique=True)
    status      = db.Column(db.String(20), default='subscribed', nullable=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)


    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
        }
    

