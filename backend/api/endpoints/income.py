from fastapi import APIRouter
from services.income_service import IncomeService
from schemas.transaction import IncomeSchema, IncomeCreate
from services.base_crud_service import GenericCRUDRouter

router = APIRouter()

income_router = GenericCRUDRouter(
    prefix="/income",
    tags=["Income"],
    service_class=IncomeService,
    create_schema=IncomeCreate,
    read_schema=IncomeSchema,
    update_schema=IncomeCreate,
).router
