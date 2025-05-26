from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .project import Project
from .task import Task
from .collaborator import Collaborator
from .comment import Comment
