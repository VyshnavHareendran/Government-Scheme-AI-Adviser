from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.routes.auth import router as auth_router
from app.api.routes.scheme import router as scheme_router
from app.api.routes import eligibility_rule
from app.api.routes import citizen_profile
from app.api.routes import rule_engine
from app.api.routes import ai_recommendation
from app.api.routes import admin
from app.api.routes import admin_citizens
from app.api.routes import admin_employees
from app.api.routes import employee_customers
from app.api.routes.application import router as application_router

from app.core.config import settings
from app.database.session import engine

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="CIVORA platform for discovering schemes, checking eligibility, receiving recommendations, and tracking applications.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://civora-sand.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": f"{settings.APP_NAME} backend is running.",
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
app.include_router(application_router)
app.include_router(eligibility_rule.router)
app.include_router(citizen_profile.router)
app.include_router(rule_engine.router)
app.include_router(ai_recommendation.router)
app.include_router(admin.router)
app.include_router(admin_citizens.router)
app.include_router(admin_employees.router)
app.include_router(employee_customers.router)
