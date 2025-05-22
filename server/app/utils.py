from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask_restful import abort
from models.user import User

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user = User.query.get(get_jwt_identity())
        if not user or not user.is_admin():
            abort(403, message="Admin privileges required.")
        return fn(*args, **kwargs)
    return wrapper
