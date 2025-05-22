# server/main.py
from flask import Flask, jsonify
from config import Config
from extensions import db, jwt, cors, migrate

# BLUEPRINTS
from routes.auth_routes         import auth_bp
from routes.preference_routes   import pref_bp
from routes.project_routes      import project_bp
from routes.task_routes         import task_bp
from routes.comment_routes      import comment_bp
from routes.collaborator_routes import collab_bp
from routes.notification_routes import notification_bp
from routes.team_routes         import team_bp
from routes.newsletter_routes   import newsletter_bp


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    # ─── INIT EXTENSIONS ──────────────────────────────────────────────────────
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": Config.CORS_ORIGINS}},
        supports_credentials=True
    )

    # ─── REGISTER BLUEPRINTS ──────────────────────────────────────────────────
    app.register_blueprint(auth_bp,         url_prefix="/api/auth")
    app.register_blueprint(pref_bp,         url_prefix="/api/user")
    app.register_blueprint(project_bp,      url_prefix="/api/projects")
    app.register_blueprint(task_bp,         url_prefix="/api/tasks")
    app.register_blueprint(comment_bp,      url_prefix="/api/comments")
    app.register_blueprint(collab_bp,       url_prefix="/api/collaborators")
    app.register_blueprint(notification_bp, url_prefix="/api/notifications")
    app.register_blueprint(team_bp,         url_prefix="/api/teams")
    app.register_blueprint(newsletter_bp,   url_prefix="/api/newsletter")

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
