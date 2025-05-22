# server/routes/preference_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User

pref_bp = Blueprint('pref_bp', __name__, url_prefix='/api/user')

@pref_bp.route('/preferences', methods=['POST', 'PUT'])
@jwt_required()
def set_preferences():
    uid = get_jwt_identity()
    data = request.get_json() or {}

    user = User.query.get_or_404(uid)
    category    = data.get('category')
    subcategory = data.get('subcategory')
    if not category or not subcategory:
        return jsonify({'error': 'category and subcategory required'}), 400

    user.category             = category
    user.subcategory          = subcategory
    user.onboarding_completed = True
    db.session.commit()

    return jsonify({'message': 'Preferences saved successfully', 'user': user.serialize()}), 200
