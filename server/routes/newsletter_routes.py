from flask import Blueprint, request, jsonify
from datetime import date
from extensions import db
from models.newsletter import Newsletter

newsletter_bp = Blueprint('newsletter_bp', __name__,url_prefix='/api/newsletter')

@newsletter_bp.route('', methods=['POST'])
def subscribe():
    data = request.get_json() or {}
    if not data.get('email'):
        return jsonify({'error':'Email required'}), 400

    # check if email already exists
    existing_subscription = Newsletter.query.filter_by(email=data['email']).first()
    if existing_subscription:
        return jsonify({'error':'Email already subscribed'}), 400
   
    newsletter = Newsletter(email=data['email'])
    db.session.add(newsletter)
    db.session.commit()
   
    return jsonify({'message':'Subscribed successfully'}), 201
