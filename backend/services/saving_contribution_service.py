from sqlalchemy.orm import Session
from models.transaction import SavingGoal, SavingContribution, TransactionType
from schemas.transaction import SavingContributionCreate
from services.base_crud_service import BaseCRUDService
from models.user import User


class SavingContributionService(BaseCRUDService):
    def __init__(self, db: Session):
        super().__init__(SavingContribution, db)

    def create(
        self,
        *,
        obj_in: SavingContributionCreate,
        current_user: User
    ) -> SavingContribution:
        goal = self.db.get(SavingGoal, obj_in.saving_goal_id)

        data = obj_in.model_dump(exclude={"description", "owner_id"})
        data["owner_id"] = current_user.id
        data["type"] = TransactionType.SAVING_CONTRIBUTION
        data["description"] = obj_in.description or f"Contribution to {goal.title}"

        contribution = self.model(**data)
        self.db.add(contribution)
        self.db.commit()
        self.db.refresh(contribution)
        return contribution
