from flask import Blueprint, jsonify, request
import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db


from models.message import Message
from models.notification import Notification
from models.user import User

chat_bp = Blueprint('chat_bp', __name__, url_prefix='/api/chat')

def _get_current_user_id():
    """Helper to pull integer ID out of JWT (which stores it as a string)."""
    raw = get_jwt_identity()
    try:
        return int(raw)
    except (TypeError, ValueError):
        return None


@chat_bp.route('', methods=['POST'])
@jwt_required()
def send_message():
    data = request.get_json()

    # Get current user ID from JWT
    current_user_id = get_jwt_identity()
    
    # Validate required fields
    if not all(key in data for key in ['recipient_id', 'content']):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Get recipient user
        recipient = User.query.get(data['recipient_id'])
        if not recipient:
            return jsonify({'error': 'Recipient not found'}), 404

        # Create and save the message
        message = Message(
            sender_id=current_user_id,
            recipient_id=data['recipient_id'],
            content=data['content'],
            timestamp=datetime.datetime.utcnow()
        )

        # Create notification
        sender = User.query.get(current_user_id)
        sender_name = f"{sender.first_name} {sender.last_name}" if sender else "Unknown User"
        
        notification = Notification(
            user_id=data['recipient_id'],
            message=f'New message from {sender_name}: {data["content"][:50]}...',  # Truncate long messages
            created_at=datetime.datetime.utcnow()
        )

        # Add to session and commit
        db.session.add(message)
        db.session.add(notification)
        db.session.commit()
        
        return jsonify({
            'message': 'Message sent successfully',
            'message_id': message.id,
            'notification_id': notification.id
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/<int:recipient_id>', methods=['GET'])
@jwt_required()
def get_messages(recipient_id):
    current_user = _get_current_user_id()
    
    if not current_user:
        return jsonify({'error': 'Invalid user identity'}), 422

    messages = Message.query.filter(
        ((Message.sender_id == current_user) & (Message.recipient_id == recipient_id)) |
        ((Message.sender_id == recipient_id) & (Message.recipient_id == current_user))
    ).order_by(Message.timestamp.asc()).all()

    return jsonify([m.serialize() for m in messages]), 200



