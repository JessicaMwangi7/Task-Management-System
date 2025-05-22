from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from extensions import db
from models.collaborator import Collaborator

collab_bp = Blueprint('collab_bp', __name__)

@collab_bp.route('/collaborators', methods=['POST'])
@jwt_required()
def add_collab():
    data = request.get_json() or {}
    for f in ('user_id','project_id'):
        if not data.get(f):
            return jsonify({'error':f'{f} required'}), 400

    c = Collaborator(
      user_id    = data['user_id'],
      project_id = data['project_id'],
      role       = data.get('role','member')
    )
    db.session.add(c); db.session.commit()
    return jsonify(c.serialize()), 201
