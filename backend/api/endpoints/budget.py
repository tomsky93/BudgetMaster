from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract
from models.budget import Budget
from models.user import User
from schemas.budget import BudgetSchema, BudgetCreate
from services.budget_service import BudgetService
from dependencies import get_db
from services.auth import get_current_user
from services.base_crud_service import GenericCRUDRouter
from typing import Optional
from sqlalchemy import extract, cast, Date

router = APIRouter()

budget_router = GenericCRUDRouter(
    prefix="/budget",
    tags=["Budget"],
    service_class=BudgetService,
    create_schema=BudgetCreate,
    read_schema=BudgetSchema,
    update_schema=BudgetCreate,
).router


@router.get("/budget", response_model=Optional[BudgetSchema])
async def read_budget(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    month: int = None,
    year: int = None
):
    if month and year:
        budget = (
            db.query(Budget)
            .filter(
                Budget.owner_id == current_user.id,
                extract('month', cast(Budget.date, Date)) == month,
                extract('year',  cast(Budget.date, Date)) == year,
            )
            .first()
        )
        return budget
    return None
