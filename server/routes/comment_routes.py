# server/routes/comment_routes.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.task import Task
from models.comment import Comment

comment_bp = Blueprint('comment_bp', __name__)

@comment_bp.route('/comments/<int:task_id>', methods=['GET'])
@jwt_required()
def get_comments(task_id):
    # ensure the task exists
    Task.query.get_or_404(task_id)

    comments = Comment.query.filter_by(task_id=task_id).order_by(Comment.created_at.asc()).all()
    return jsonify([c.serialize() for c in comments]), 200

@comment_bp.route('/comments', methods=['POST'])
@jwt_required()
def add_comment():
    data    = request.get_json() or {}
    task_id = data.get('task_id')
    text    = data.get('text')

    if not task_id or not text:
        return jsonify({'error': 'Both task_id and text are required.'}), 400

    # ensure the parent task exists
    Task.query.get_or_404(task_id)

    comment = Comment(
        task_id = task_id,
        user_id = get_jwt_identity(),
        text    = text
    )
    db.session.add(comment)
    db.session.commit()

    return jsonify(comment.serialize()), 201
