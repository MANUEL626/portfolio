"""Configuration de l'application Flask."""
import os


class Config:
    """Configuration de base."""
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key-change-en-prod"
    DEBUG = os.environ.get("FLASK_DEBUG", "1").lower() in ("1", "true", "yes")
