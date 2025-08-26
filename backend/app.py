from __future__ import annotations
from flask import Flask
from backend.routes import bp as leads_bp

def create_app() -> Flask:
    app = Flask(__name__)
    # register blueprints
    app.register_blueprint(leads_bp)
    return app

# For "python backend/app.py" quick run:
app = create_app()

if __name__ == "__main__":
    # Dev server with auto-reload if possible
    app.run(host="127.0.0.1", port=5000, debug=True)
