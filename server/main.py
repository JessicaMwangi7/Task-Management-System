# server/main.py

from flask import Flask, jsonify
# Import config and extensions relative to this package
from config import Config
from extensions import db, jwt, cors, migrate

# Blueprint imports
from routes.auth_routes         import auth_bp
from routes.preference_routes    import pref_bp
from routes.project_routes       import project_bp
from routes.task_routes          import task_bp
from routes.comment_routes       import comment_bp
from routes.collaborator_routes  import collab_bp
from routes.notification_routes  import notification_bp
from routes.team_routes          import team_bp
from routes.newsletter_routes    import newsletter_bp
from routes.user_routes          import user_bp
from routes.chat_routes          import chat_bp  # Uncomment if chat routes are needed


def create_app():
    """
    Application factory: creates and configures the Flask app.
    """
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": Config.CORS_ORIGINS}},
        supports_credentials=True
    )

    # Register blueprints under /api/*
    app.register_blueprint(auth_bp,         url_prefix="/api/auth")
    app.register_blueprint(pref_bp,         url_prefix="/api/user")
    app.register_blueprint(project_bp,      url_prefix="/api/projects")
    app.register_blueprint(task_bp,         url_prefix="/api/tasks")
    app.register_blueprint(comment_bp,      url_prefix="/api/comments")
    app.register_blueprint(collab_bp,       url_prefix="/api/collaborators")
    app.register_blueprint(notification_bp, url_prefix="/api/notifications")
    app.register_blueprint(team_bp,         url_prefix="/api/teams")
    app.register_blueprint(newsletter_bp,   url_prefix="/api/newsletter")
    app.register_blueprint(user_bp,         url_prefix="/api/user")
    app.register_blueprint(chat_bp,         url_prefix="/api/chat")  # Uncomment if chat routes are needed

    @app.route("/", methods=["GET"])
    def hello():
        return jsonify({"message": "TaskFlow API"}), 200

    @app.route("/healthz", methods=["GET"])
    def health():
        return jsonify({"status": "ok"}), 200

    return app

# # Expose the app for Flask CLI or WSGI servers
# app = create_app()

# if __name__ == "__main__":
#     app.run(debug=True, host="0.0.0.0", port=5000)
