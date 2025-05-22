from flask_restful import Resource
from models.user import User
from extensions import db
from app.utils import admin_required

class AdminUserList(Resource):
    method_decorators = [admin_required]

    def get(self):
        users = User.query.all()
        return [
            {"id": u.id, "username": u.username, "email": u.email, "role": u.role}
            for u in users
        ], 200

class AdminUserResource(Resource):
    method_decorators = [admin_required]

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted."}, 200
