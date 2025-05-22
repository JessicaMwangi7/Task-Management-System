from flask import Blueprint, jsonify
from extensions import db
from models.user import User

team_bp = Blueprint('team_bp', __name__)

@team_bp.route('/admin/users', methods=['GET'])
def list_users():
    return jsonify([u.serialize() for u in User.query.all()]), 200

@team_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    u = User.query.get_or_404(user_id)
    db.session.delete(u); db.session.commit()
    return '', 204
