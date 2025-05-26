from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from extensions import db

from models.collaborator import Collaborator

collab_bp = Blueprint('collab_bp', __name__,url_prefix='/api/collaborators')

@collab_bp.route('', methods=['POST'])
@jwt_required()
def add_collab():
    data = request.get_json() or {}

    for f in ('user_id','project_id'):
        if not data.get(f):
            return jsonify({'error':f'{f} required'}), 400

    # Check if the user is already a collaborator in the project
    existing_collab = Collaborator.query.filter_by(
        user_id=data['user_id'],
        project_id=data['project_id']
    ).first()
    if existing_collab:
        return jsonify({'error': 'User is already a collaborator in this project'}), 400
    # Create and save the collaborator

    c = Collaborator(
      user_id    = data['user_id'],
      project_id = data['project_id'],
      role       = data.get('role','member')
    )
    db.session.add(c); db.session.commit()
    return jsonify(c.serialize()), 201
