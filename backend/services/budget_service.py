from sqlalchemy.orm import Session
from services.base_crud_service import BaseCRUDService


class BudgetService(BaseCRUDService):
    def __init__(self, db: Session):
        from models.budget import Budget
        super().__init__(Budget, db)
