from flask import Blueprint, request, jsonify

newsletter_bp = Blueprint('newsletter_bp', __name__)

@newsletter_bp.route('/newsletter', methods=['POST'])
def subscribe():
    data = request.get_json() or {}
    if not data.get('email'):
        return jsonify({'error':'Email required'}), 400
    # TODO: persist subscription...
    return jsonify({'message':'Subscribed successfully'}), 201
