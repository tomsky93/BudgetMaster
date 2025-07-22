from fastapi import APIRouter
from schemas.expense_category import ExpenseCategorySchema, ExpenseCategoryCreate
from services.expense_category_service import ExpenseCategoryService
from services.base_crud_service import GenericCRUDRouter

router = APIRouter()

expense_category_router = GenericCRUDRouter(
    prefix="/expense_categories",
    tags=["Expense Categories"],
    service_class=ExpenseCategoryService,
    create_schema=ExpenseCategoryCreate,
    read_schema=ExpenseCategorySchema,
    update_schema=ExpenseCategoryCreate,
).router
