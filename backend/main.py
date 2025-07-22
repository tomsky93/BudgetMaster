from datetime import datetime
import settings
from fastapi import FastAPI, APIRouter
from database import get_engine, get_session_local, Base
from exceptions import register_exception_handlers
from fastapi.middleware.cors import CORSMiddleware
from api.endpoints import user, expense_aggregate
from api.endpoints.expense_category import expense_category_router
from api.endpoints.income import income_router
from api.endpoints.expense import expense_router
from api.endpoints.budget import budget_router
from api.endpoints.recurring_expense import recurring_expense_router_monthly
from api.endpoints.recurring_expense import recurring_expense_router
from api.endpoints.saving_goal import saving_goal_router
from api.endpoints.saving_contribution import saving_contrib_router
from fastapi.openapi.utils import get_openapi
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from tasks import process_recurring_expenses
from contextlib import asynccontextmanager

router = APIRouter()
app = FastAPI()
register_exception_handlers(app)

origins = settings.CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count"],
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
    )
    openapi_schema.setdefault("components", {}).setdefault("securitySchemes", {})["CookieAuth"] = {
        "type": "apiKey",
        "in": "cookie",
        "name": "access_token",
    }
    for path in openapi_schema.get("paths", {}).values():
        for operation in path.values():
            operation.setdefault("security", []).append({"CookieAuth": []})
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

def init_app(database_url: str = None, testing: bool = False):
    extra_args = {"poolclass": __import__("sqlalchemy.pool", fromlist=["StaticPool"]).StaticPool} if testing else {}
    engine = get_engine(database_url=database_url, **extra_args)
    SessionLocal = get_session_local(engine)
    
    Base.metadata.create_all(bind=engine)

    app.state.engine = engine
    app.include_router(router)
    return SessionLocal

app.include_router(user.router)
app.include_router(expense_aggregate.router)
app.include_router(recurring_expense_router_monthly) 
app.include_router(budget_router)
app.include_router(expense_category_router)
app.include_router(income_router)
app.include_router(expense_router)
app.include_router(recurring_expense_router)
app.include_router(saving_goal_router)
app.include_router(saving_contrib_router)

def create_scheduler(session_factory):
    sched = AsyncIOScheduler(timezone="Europe/Warsaw")

    sched.add_job(
        func=lambda: process_recurring_expenses(session_factory),
        trigger="cron",
        hour=0,
        minute=0,
        id="recurring_expenses_daily"
    )

    sched.add_job(
        func=lambda: process_recurring_expenses(session_factory),
        trigger="interval",
        minutes=60,
        next_run_time=datetime.now(),
        id="recurring_expenses_interval"
    )

    return sched

SessionLocal = init_app()

app.state.scheduler = create_scheduler(SessionLocal)

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.scheduler.start()
    try:
        yield
    finally:
        app.state.scheduler.shutdown()

app.router.lifespan_context = lifespan
