from sqlalchemy.orm import Session
from services.base_crud_service import BaseCRUDService


class ExpenseCategoryService(BaseCRUDService):
    def __init__(self, db: Session):
        from models.expense_category import ExpenseCategory
        super().__init__(ExpenseCategory, db)
