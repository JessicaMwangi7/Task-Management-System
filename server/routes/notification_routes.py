from flask import Blueprint, jsonify

notification_bp = Blueprint('notification_bp', __name__)

@notification_bp.route('/notifications', methods=['GET'])
def get_notifications():
    sample = [
      {'id':1,'title':'Welcome!','message':'Thanks for joining TaskFlow.'},
      {'id':2,'title':'Reminder','message':'Task XYZ is due tomorrow.'}
    ]
    return jsonify(sample), 200
