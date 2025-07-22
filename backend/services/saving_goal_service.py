from sqlalchemy.orm import Session
from services.base_crud_service import BaseCRUDService


class SavingGoalService(BaseCRUDService):
    def __init__(self, db: Session):
        from models.transaction import SavingGoal

        super().__init__(SavingGoal, db)
