import settings
from database import get_engine, get_session_local, Base

DATABASE_URL = settings.DATABASE_URL
engine = get_engine(database_url=DATABASE_URL)
SessionLocal = get_session_local(engine)
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()