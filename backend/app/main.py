from fastapi import FastAPI
from sqlalchemy import text

from app.api.routes.auth import router as auth_router
from app.api.routes.scheme import router as scheme_router
from app.api.routes import eligibility_rule
from app.api.routes import citizen_profile
from app.api.routes import rule_engine
from app.api.routes import ai_recommendation

from app.core.config import settings
from app.database.session import engine

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered platform for discovering and checking eligibility for Government Schemes.",
)


@app.get("/")
def root():
    return {
        "message": f"{settings.APP_NAME} Backend Running 🚀",
        "version": settings.APP_VERSION,
        "debug": settings.DEBUG,
    }


@app.get("/health/database")
def database_health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "database": "Connected"
    }

app.include_router(auth_router)
app.include_router(scheme_router)
app.include_router(eligibility_rule.router)
app.include_router(citizen_profile.router)
app.include_router(rule_engine.router)
app.include_router(ai_recommendation.router)