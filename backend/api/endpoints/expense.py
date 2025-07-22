from fastapi import APIRouter
from schemas.transaction import ExpenseSchema, ExpenseCreate
from services.expense_service import ExpenseService
from services.base_crud_service import GenericCRUDRouter

router = APIRouter()

expense_router = GenericCRUDRouter(
    prefix="/expenses",
    tags=["Expenses"],
    service_class=ExpenseService,
    create_schema=ExpenseCreate,
    read_schema=ExpenseSchema,
    update_schema=ExpenseCreate,
).router
