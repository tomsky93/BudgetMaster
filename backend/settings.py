import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", default="http://localhost,http://localhost:5173,http://127.0.01:5173").split(",")

SECRET_KEY= os.getenv("SECRET_KEY", default="y4f}TtQGDCWC}u09i@H(1W]MXU>H~mG3rbwn:Rqz$z']7_OSiz78F92^ob~(zI<")
ALGORITHM = os.getenv("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES  = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", default=1440))
DATABASE_URL= os.getenv("DATABASE_URL", default="postgresql://user:password@localhost:5432/expenses_db")
COOKIE_SECURE = os.getenv("COOKIE_SECURE", default="False")
SAME_SITE = os.getenv("SAME_SITE", default="Lax")
MAX_AGE = int(os.getenv("MAX_AGE", default=86400))  # in seconds, default is 1 day
COOKIE_KEY = os.getenv("COOKIE_KEY", default="access_token")