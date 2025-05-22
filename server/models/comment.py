from datetime import datetime
from extensions import db

class Comment(db.Model):
    __tablename__ = 'comment'
    id         = db.Column(db.Integer, primary_key=True)
    task_id    = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    user_id    = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text       = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    task   = db.relationship('Task', back_populates='comments')
    author = db.relationship('User', back_populates='comments')

    def serialize(self):
        return {
            'id': self.id,
            'task_id': self.task_id,
            'user_id': self.user_id,
            'text': self.text,
            'created_at': self.created_at.isoformat()
        }
