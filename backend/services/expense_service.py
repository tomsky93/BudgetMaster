from sqlalchemy.orm import Session
from services.base_crud_service import BaseCRUDService


class ExpenseService(BaseCRUDService):
    def __init__(self, db: Session):
        from models.transaction import Expense
        super().__init__(Expense, db)
