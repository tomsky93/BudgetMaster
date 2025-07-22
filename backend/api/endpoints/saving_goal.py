from fastapi import APIRouter
from services.saving_goal_service import SavingGoalService
from schemas.transaction import SavingGoalSchema, SavingGoalCreate
from services.base_crud_service import GenericCRUDRouter

router = APIRouter()

saving_goal_router = GenericCRUDRouter(
    prefix="/savings",
    tags=["Saving Goals"],
    service_class=SavingGoalService,
    create_schema=SavingGoalCreate,
    read_schema=SavingGoalSchema,
    update_schema=SavingGoalCreate,
).router
