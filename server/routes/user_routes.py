# app/routes/user.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User

user_bp = Blueprint('user_bp', __name__, url_prefix='/api/user')

@user_bp.route('/preferences', methods=['POST'])
@jwt_required()
def set_preferences():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    category    = data.get('category')
    subcategory = data.get('subcategory')

    if not category or not subcategory:
        return jsonify({'error': 'category and subcategory required'}), 400

    user = User.query.get_or_404(user_id)
    user.category             = category
    user.subcategory          = subcategory
    user.onboarding_completed = True
    db.session.commit()
    return '', 204

# get all users
@user_bp.route('/all', methods=['GET']) 
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200

