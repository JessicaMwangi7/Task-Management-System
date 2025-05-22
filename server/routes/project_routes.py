# server/routes/project_routes.py

import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.project import Project
from models.task    import Task

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

# All routes under /api/projects
project_bp = Blueprint('project_bp', __name__, url_prefix='/api/projects')

@project_bp.route('', methods=['GET'])
@jwt_required()
def list_user_projects():
    uid = get_jwt_identity()
    if not isinstance(uid, int):
        return jsonify({'error': 'Invalid user identity'}), 422

    projects = Project.query.filter_by(owner_id=uid).all()
    return jsonify([p.serialize() for p in projects]), 200

@project_bp.route('/all', methods=['GET'])
def list_all_projects():
    # Public list of every project
    projects = Project.query.all()
    return jsonify([p.serialize() for p in projects]), 200

@project_bp.route('/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    uid = get_jwt_identity()
    if not isinstance(uid, int):
        return jsonify({'error': 'Invalid user identity'}), 422

    project = Project.query.get_or_404(project_id)
    if project.owner_id != uid:
        return jsonify({'error': 'Access forbidden'}), 403

    tasks = Task.query.filter_by(project_id=project_id).all()
    return jsonify({
        'project': project.serialize(),
        'tasks':   [t.serialize() for t in tasks]
    }), 200

@project_bp.route('', methods=['POST'])
@jwt_required()
def create_project():
    uid = get_jwt_identity()
    if not isinstance(uid, int):
        return jsonify({'error': 'Invalid user identity'}), 422

    data = request.get_json() or {}
    name = data.get('name')
    if not name or not isinstance(name, str):
        return jsonify({'error': 'Name is required and must be a string'}), 400

    project = Project(
        name        = name,
        description = data.get('description'),
        owner_id    = uid
    )
    db.session.add(project)
    db.session.commit()
    return jsonify(project.serialize()), 201

@project_bp.route('/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    uid = get_jwt_identity()
    if not isinstance(uid, int):
        return jsonify({'error': 'Invalid user identity'}), 422

    project = Project.query.get_or_404(project_id)
    if project.owner_id != uid:
        return jsonify({'error': 'Access forbidden'}), 403

    data = request.get_json() or {}
    if 'name' in data:
        if not isinstance(data['name'], str):
            return jsonify({'error': 'Name must be a string'}), 400
        project.name = data['name']
    if 'description' in data:
        if not isinstance(data['description'], str):
            return jsonify({'error': 'Description must be a string'}), 400
        project.description = data['description']

    db.session.commit()
    return jsonify(project.serialize()), 200

@project_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    uid = get_jwt_identity()
    if not isinstance(uid, int):
        return jsonify({'error': 'Invalid user identity'}), 422

    project = Project.query.get_or_404(project_id)
    if project.owner_id != uid:
        return jsonify({'error': 'Access forbidden'}), 403

    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'Project deleted'}), 200
