from flask import Blueprint, request, jsonify
from datetime import date
from flask_jwt_extended import jwt_required
from extensions import db
from models.task    import Task
from models.project import Project
from models.notification import Notification

task_bp = Blueprint('task_bp', __name__,url_prefix='/api/tasks')

@task_bp.route('/<int:project_id>', methods=['POST'])
@jwt_required()
def create_task(project_id):
    print("add a task")
    print(project_id)
    data = request.get_json() or {}
    if not data.get('title'):
        return jsonify({'error':'Task title required'}), 400
    Project.query.get_or_404(project_id)

    t = Task(
      title       = data['title'],
      description = data.get('description'),
      due_date    = date.fromisoformat(data.get('due_date')),
      assignee_id = data.get('assignee_id'),
      project_id  = project_id
    )

    # also add a notification for the assignee if they are different from the creator
    n  =  Notification(
        user_id    = data.get('assignee_id'),
        message    = f'New task assigned: {t.title} in project {project_id} has been created.',

        )

#   commit the notification first
    db.session.add(n)
    db.session.add(t); 
    db.session.commit()
    return jsonify({'task':t.serialize()}), 201

@task_bp.route('/projects/<int:project_id>/tasks', methods=['GET'])
@jwt_required()
def list_tasks(project_id):
    Project.query.get_or_404(project_id)
    return jsonify([t.serialize() for t in Task.query.filter_by(project_id=project_id).all()]), 200


@task_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    t = Task.query.get_or_404(task_id)
    return jsonify({'task':t.serialize()}), 200


@task_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    data = request.get_json() or {}
    # format due_date if provided in string format
    if 'due_date' in data and isinstance(data['due_date'], str):
        try:
            data['due_date'] = date.fromisoformat(data['due_date'])
        except ValueError:
            return jsonify({'error': 'Invalid date format for due_date'}), 400

    t = Task.query.get_or_404(task_id)
    # get assignee_id the current id from the task
    assignee_id = t.assignee_id


    for f in ('title','description','status','due_date','assignee_id'):
        if f in data:
            setattr(t, f, data[f])


    # if the assignee is changed, add a notification and to the owner
   
    db.session.add(t)

    db.session.commit()
    return jsonify({'task':t.serialize()}), 200




@task_bp.route('/status/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_status_task(task_id):
    data = request.get_json() or {}
    # format due_date if provided in string format
    if 'due_date' in data and isinstance(data['due_date'], str):
        try:
            data['due_date'] = date.fromisoformat(data['due_date'])
        except ValueError:
            return jsonify({'error': 'Invalid date format for due_date'}), 400

    t = Task.query.get_or_404(task_id)
    # get assignee_id the current id from the task
    assignee_id = t.assignee_id


    for f in ('title','description','status','due_date','assignee_id'):
        if f in data:
            setattr(t, f, data[f])


    # if the assignee is changed, add a notification and to the owner
    n = Notification(
        user_id    = assignee_id,
        message    = f'Task {t.title} has been updated. New status  : {data.get("status")}.',
    )
    db.session.add(n)
    db.session.add(t)

    db.session.commit()
    return jsonify({'task':t.serialize()}), 200


@task_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    t = Task.query.get_or_404(task_id)
    db.session.delete(t); db.session.commit()
    return '', 204
