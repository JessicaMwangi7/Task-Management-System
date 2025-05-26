from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.user import User

# Blueprint with URL prefix for user-related routes
pref_bp = Blueprint('pref_bp', __name__, url_prefix='/api/user')

@pref_bp.route('/preferences', methods=['PUT'])
@jwt_required()
def set_preferences():
    """
    Update onboarding preferences for the authenticated user.
    Expects JSON with 'category' and 'subcategory'.
    """
    # Get current user's ID from JWT
    uid = get_jwt_identity()
    # Parse JSON body
    data = request.get_json() or {}

    # Fetch user or return 404
    user = User.query.get_or_404(uid)

    # Update preferences fields
    user.category = data.get('category', user.category)
    user.subcategory = data.get('subcategory', user.subcategory)
    user.onboarding_completed = True

    # Persist changes
    db.session.commit()

    # Return updated user data
    return jsonify({
        'message': 'Preferences saved successfully',
        'user': user.serialize()
    }), 200
