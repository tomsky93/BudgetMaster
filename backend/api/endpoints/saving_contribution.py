from fastapi import APIRouter, Depends
from pytest import Session
from dependencies import get_db
from schemas.transaction import SavingContributionCreate, SavingContributionRead
from services.auth import get_current_user
from services.saving_contribution_service import SavingContributionService

saving_contrib_router = APIRouter()


@saving_contrib_router.post("/deposit/{goal_id}", response_model=SavingContributionRead)
def deposit_to_goal(
    goal_id: int,
    payload: SavingContributionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    payload.saving_goal_id = goal_id
    service = SavingContributionService(db)
    return service.create(obj_in=payload, current_user=current_user)
