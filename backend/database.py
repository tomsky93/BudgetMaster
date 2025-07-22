import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import Optional

Base = declarative_base()

def get_engine(database_url: Optional[str] = None, **kwargs):
    if not database_url:
        database_url = os.getenv("DATABASE_URL", "sqlite:///./db.sqlite3")
    connect_args = {"check_same_thread": False} if "sqlite" in database_url else {}

    if database_url == "sqlite:///:memory:":
        from sqlalchemy.pool import StaticPool
        kwargs.setdefault("poolclass", StaticPool)

    return create_engine(database_url, connect_args=connect_args, **kwargs)

def get_session_local(engine):
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)

engine = get_engine()
SessionLocal = get_session_local(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()