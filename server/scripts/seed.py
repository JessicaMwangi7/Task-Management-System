# server/scripts/seed.py

import os
import sys
from datetime import datetime, timedelta

# allow imports from the server package
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import create_app
from extensions import db

# your models
from models.user         import User
from models.project      import Project
from models.collaborator import Collaborator
from models.task         import Task
from models.comment      import Comment

def run():
    app = create_app()
    with app.app_context():
        # ─── DROP & RECREATE ALL TABLES 
        db.drop_all()
        db.create_all()

        # ─── CREATE USERS 
        admin = User(
            first_name="Alice",
            last_name="Admin",
            email="alice.admin@example.com",
            role="admin",
        )
        admin.set_password("password123")

        bob = User(
            first_name="Bob",
            last_name="Builder",
            email="bob.builder@example.com",
            role="user",
        )
        bob.set_password("password123")

        carol = User(
            first_name="Carol",
            last_name="Creator",
            email="carol.creator@example.com",
            role="user",
        )
        carol.set_password("password123")

        db.session.add_all([admin, bob, carol])
        db.session.commit()

        # ─── CREATE PROJECTS 
        p1 = Project(
            name="Website Redesign",
            description="Overhaul the landing page and refresh branding",
            owner_id=admin.id,
        )
        p2 = Project(
            name="Mobile App MVP",
            description="Initial version of the TaskFlow mobile client",
            owner_id=bob.id,
        )
        db.session.add_all([p1, p2])
        db.session.commit()

        # ─── ADD COLLABORATORS 
        # Bob & Carol join Alice's project
        c1 = Collaborator(user_id=bob.id,   project_id=p1.id, role="member")
        c2 = Collaborator(user_id=carol.id, project_id=p1.id, role="member")
        # Alice joins Bob's project as admin
        c3 = Collaborator(user_id=admin.id, project_id=p2.id, role="admin")
        db.session.add_all([c1, c2, c3])
        db.session.commit()

        # ─── CREATE TASKS 
        t1 = Task(
            title="Wireframe sketches",
            description="Draw rough wireframes for the new homepage",
            status="pending",
            due_date=datetime.utcnow() + timedelta(days=3),
            project_id=p1.id,
            assignee_id=bob.id,
        )
        t2 = Task(
            title="Set up React project",
            description="Bootstrap with Vite + Tailwind",
            status="pending",
            due_date=datetime.utcnow() + timedelta(days=5),
            project_id=p2.id,
            assignee_id=bob.id,
        )
        t3 = Task(
            title="Design logo",
            description="Create a modern flat-design logo",
            status="pending",
            due_date=datetime.utcnow() + timedelta(days=7),
            project_id=p1.id,
            assignee_id=carol.id,
        )
        db.session.add_all([t1, t2, t3])
        db.session.commit()

        # ─── ADD COMMENTS
        cm1 = Comment(task_id=t1.id, user_id=carol.id, text="I like these sketches—can we try a darker palette?")
        cm2 = Comment(task_id=t2.id, user_id=admin.id, text="Be sure to include auth context and routing.")
        cm3 = Comment(task_id=t3.id, user_id=bob.id,   text="Logo should work on both light & dark backgrounds.")
        db.session.add_all([cm1, cm2, cm3])
        db.session.commit()

        print("✅ Database seeded with users, projects, collaborators, tasks & comments")

if __name__ == "__main__":
    run()
