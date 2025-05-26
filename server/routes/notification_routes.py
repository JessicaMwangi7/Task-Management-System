from flask import Blueprint, request, jsonify
from datetime import date
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db

from models.notification import Notification
notification_bp = Blueprint('notification_bp', __name__, url_prefix='/api/notifications')


def _get_current_user_id():
    """Helper to pull integer ID out of JWT (which stores it as a string)."""
    raw = get_jwt_identity()
    try:
        return int(raw)
    except (TypeError, ValueError):
        return None

@notification_bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = _get_current_user_id()
    if user_id is None:
        return jsonify({'error': 'Invalid user identity'}), 422
    # order by created_at descending
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    if not notifications:
        
        return jsonify([]), 200
    return jsonify([n.serialize() for n in notifications]), 200
    return jsonify(sample), 200
