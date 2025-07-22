import settings
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from dependencies import get_db
from models.user import User
from schemas.user import UserSchema, UserCreate, UserUpdate, ChangePasswordRequest
from fastapi import APIRouter, Depends, HTTPException, status, Response, Depends
from services.auth import authenticate_user, get_current_user, create_access_token, get_password_hash, verify_password

router = APIRouter()

COOKIE_KEY = settings.COOKIE_KEY
COOKIE_SECURE = settings.COOKIE_SECURE.lower() == "true"
SAME_SITE = settings.SAME_SITE.lower()
MAX_AGE = int(settings.MAX_AGE)


@router.post("/token")
def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    expires = timedelta(seconds=MAX_AGE)
    token = create_access_token(
        data={"sub": user.username},
        expires_delta=expires
    )

    response.set_cookie(
        key=COOKIE_KEY,
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=SAME_SITE,
        max_age=MAX_AGE
    )
    return {"message": "Login successful"}


@router.get("/me")
def read_users_me(current_user=Depends(get_current_user)):
    return current_user


@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(
            status_code=400, detail="Username already registered")

    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        hashed_password=hashed_password,
        currency=user.currency,
        locale=user.locale,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get("/profile", response_model=UserSchema, status_code=status.HTTP_200_OK)
def get_profile(
    current_user: User = Depends(get_current_user),
):
    return current_user


@router.post("/change-password")
def change_password(
    req: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == current_user.id).first()

    if verify_password(req.new_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The new password must not be the same as the current one."
        )

    user.hashed_password = get_password_hash(req.new_password)
    db.add(user)
    db.commit()

    return {"message": "Password changed successfully."}


@router.patch("/update-profile", response_model=UserSchema, status_code=status.HTTP_200_OK)
def update_preferences(
    prefs: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = False

    if prefs.currency:
        current_user.currency = prefs.currency.upper()
        updated = True

    if prefs.locale:
        current_user.locale = prefs.locale
        updated = True

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No changes were made to the profile.",
        )

    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response):

    response.delete_cookie(
        key=COOKIE_KEY,

    )
    return {"message": "Logout successful"}
