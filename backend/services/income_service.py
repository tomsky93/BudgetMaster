from sqlalchemy.orm import Session
from services.base_crud_service import BaseCRUDService


class IncomeService(BaseCRUDService):
    def __init__(self, db: Session):
        from models.transaction import Income

        super().__init__(Income, db)
