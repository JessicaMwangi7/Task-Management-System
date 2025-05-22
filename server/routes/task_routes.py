from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from extensions import db
from models.task    import Task
from models.project import Project

task_bp = Blueprint('task_bp', __name__)

@task_bp.route('/projects/<int:project_id>/tasks', methods=['POST'])
@jwt_required()
def create_task(project_id):
    data = request.get_json() or {}
    if not data.get('title'):
        return jsonify({'error':'Task title required'}), 400
    Project.query.get_or_404(project_id)

    t = Task(
      title       = data['title'],
      description = data.get('description'),
      due_date    = data.get('due_date'),
      assignee_id = data.get('assignee_id'),
      project_id  = project_id
    )
    db.session.add(t); db.session.commit()
    return jsonify({'task':t.serialize()}), 201

@task_bp.route('/projects/<int:project_id>/tasks', methods=['GET'])
@jwt_required()
def list_tasks(project_id):
    Project.query.get_or_404(project_id)
    return jsonify([t.serialize() for t in Task.query.filter_by(project_id=project_id).all()]), 200

@task_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    data = request.get_json() or {}
    t = Task.query.get_or_404(task_id)
    for f in ('title','description','status','due_date','assignee_id'):
        if f in data:
            setattr(t, f, data[f])
    db.session.commit()
    return jsonify({'task':t.serialize()}), 200

@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    t = Task.query.get_or_404(task_id)
    db.session.delete(t); db.session.commit()
    return '', 204
