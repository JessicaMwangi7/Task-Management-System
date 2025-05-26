# server/routes/project_routes.py

import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.project import Project

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

project_bp = Blueprint('project_bp', __name__, url_prefix='/api/projects')

def _get_current_user_id():
    """Helper to pull integer ID out of JWT (which stores it as a string)."""
    raw = get_jwt_identity()
    try:
        return int(raw)
    except (TypeError, ValueError):
        return None

@project_bp.route('', methods=['GET'])
@jwt_required()
def list_user_projects():
    uid = _get_current_user_id()
    if uid is None:
        return jsonify({'error': 'Invalid user identity'}), 422

    # projects = Project.query.filter_by(owner_id=uid).all()

    # filter by owner_id and join with tasks and collaborators
    # using joinedload to avoid N+1 query problem
    # and eager load tasks
    # and user id is in collaborator
    projects = Project.query.options(db.joinedload(Project.tasks))\
                          .filter((Project.owner_id == uid) | (Project.collaborators.any(user_id=uid)))\
                          .all()


    # projects = Project.query.options(db.joinedload(Project.tasks), db.joinedload(Project.collaborators))\
    #                       .filter_by(owner_id=uid)\
    #                       .all()

    # projects = Project.query.options(db.joinedload(Project.tasks))\
    #                       .filter_by(owner_id=uid)\
    #                       .all()

    return jsonify([p.serialize() for p in projects]), 200

@project_bp.route('/all', methods=['GET'])
@jwt_required()
def list_all_projects():
    projects = Project.query.all()
    return jsonify([p.serialize() for p in projects]), 200

@project_bp.route('/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    uid = _get_current_user_id()
    if uid is None:
        return jsonify({'error': 'Invalid user identity'}), 422

    project = Project.query.get_or_404(project_id)
    # Check if the user is the owner of the project or a collaborator
    # if project.owner_id != uid and not project.collaborators.filter_by(user_id=uid).first():
    if project.owner_id != uid and not any(c.user_id == uid for c in project.collaborators):
        return jsonify({'error': 'Access forbidden'}), 403
    # Check if the user is the owner of the project
    return jsonify(project.serialize()), 200

@project_bp.route('', methods=['POST'])
@jwt_required()
def create_project():
    uid = _get_current_user_id()
    print("add a project")
    print(uid)
    if uid is None:
        return jsonify({'error': 'Invalid user identity'}), 422

    data = request.get_json() or {}
    print(data)
    name = data.get('name')
    if not name or not isinstance(name, str):
        return jsonify({'error': 'Name is required and must be a string'}), 400

    project = Project(
        name=name,
        description=data.get('description'),
        owner_id=uid
    )
    db.session.add(project)
    db.session.commit()

    return jsonify(project.serialize()), 201

@project_bp.route('/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    uid = _get_current_user_id()
    if uid is None:
        return jsonify({'error': 'Invalid user identity'}), 422

    project = Project.query.get_or_404(project_id)
    if project.owner_id != uid:
        return jsonify({'error': 'Access forbidden'}), 403

    data = request.get_json() or {}
    if 'title' in data:
        if not isinstance(data['title'], str):
            return jsonify({'error': 'Title must be a string'}), 400
        project.title = data['title']

    if 'description' in data:
        if not isinstance(data['description'], str):
            return jsonify({'error': 'Description must be a string'}), 400
        project.description = data['description']

    db.session.commit()
    return jsonify(project.serialize()), 200

@project_bp.route('/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    uid = _get_current_user_id()
    if uid is None:
        return jsonify({'error': 'Invalid user identity'}), 422

    project = Project.query.get_or_404(project_id)
    if project.owner_id != uid:
        return jsonify({'error': 'Access forbidden'}), 403

    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'Project deleted'}), 200
