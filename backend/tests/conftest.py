# backend/tests/conftest.py
import os
import sys
import pytest

# Ensure repo root on sys.path
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from backend.app import create_app

# ✅ Clear any scoring env override so tests are deterministic
@pytest.fixture(autouse=True)
def _clear_scoring_env():
    key = "LEAD_SCORING_WEIGHTS_JSON"
    old = os.environ.pop(key, None)
    try:
        yield
    finally:
        if old is not None:
            os.environ[key] = old

@pytest.fixture(scope="session")
def app():
    app = create_app()
    app.config.update(TESTING=True)
    return app

@pytest.fixture()
def client(app):
    return app.test_client()
