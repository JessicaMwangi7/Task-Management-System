import os, sys

# make sure Python can find main.py
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import create_app   # <-- import here
from extensions import db

app = create_app()

with app.app_context():
    db.create_all()
    print("✅ All tables created successfully.")
