from fastapi import APIRouter, Depends, Query
from services.recurring_expense import RecurringExpenseService
from models.user import User
from schemas.transaction import RecurringExpenseCreate, RecurringExpenseResponse, RecurringExpenseMonthResponse
from services.base_crud_service import GenericCRUDRouter
from datetime import datetime
from sqlalchemy.orm import Session
from dependencies import get_db
from services.auth import get_current_user

router = APIRouter()

recurring_expense_router = GenericCRUDRouter(
    prefix="/recurring_expenses",
    tags=["Recurring Expenses"],
    service_class=RecurringExpenseService,
    create_schema=RecurringExpenseCreate,
    read_schema=RecurringExpenseResponse,
    update_schema=RecurringExpenseCreate,
).router


def get_recurring_expense_service(
    db: Session = Depends(get_db),
) -> RecurringExpenseService:
    return RecurringExpenseService(db)


recurring_expense_router_monthly = APIRouter()


@recurring_expense_router_monthly.get(
    "/recurring_expenses/instances",
    response_model=RecurringExpenseMonthResponse,
    tags=["Recurring Expenses"],
)
def get_monthly_instances(
    year:  int = Query(default=datetime.now().year, ge=2000),
    month: int = Query(default=datetime.now().month, ge=1, le=12),
    service: RecurringExpenseService = Depends(get_recurring_expense_service),
    current_user: User = Depends(get_current_user),
) -> RecurringExpenseMonthResponse:

    return service.list_instances_for_month(
        user_id=current_user.id,
        year=year,
        month=month,
    )
