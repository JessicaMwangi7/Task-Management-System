# server/routes/auth_routes.py

import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from extensions import db
from models.user import User

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    for field in ('first_name', 'last_name', 'email', 'password'):
        if not data.get(field):
            return jsonify({'error': f'{field} required'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400

    user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        role=data.get('role', 'user'),
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User created'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True) or {}
    email = data.get('email')
    pwd = data.get('password')
    if not email or not pwd:
        return jsonify({'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(pwd):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Cast identity to str to satisfy RFC7519 sub=string requirement
    token = create_access_token(identity=str(user.id))
    return jsonify({
        'access_token': token,
        'user': user.serialize()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    uid = get_jwt_identity()            # this will be a string
    user = User.query.get_or_404(uid)   # SQLAlchemy will cast as needed
    return jsonify(user.serialize()), 200

@auth_bp.route('/preferences', methods=['POST'])
@jwt_required()
def save_preferences():
    data = request.get_json() or {}
    cat = data.get('category')
    sub = data.get('subcategory')
    if not cat or not sub:
        return jsonify({'error': 'category & subcategory required'}), 400

    user = User.query.get_or_404(get_jwt_identity())
    user.category = cat
    user.subcategory = sub
    user.onboarding_completed = True
    db.session.commit()

    return jsonify({
        'message': 'Preferences saved',
        'user': user.serialize()
    }), 200
