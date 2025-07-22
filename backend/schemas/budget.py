from pydantic import BaseModel, ConfigDict
import datetime

class BudgetBase(BaseModel):
    date: datetime.date
    amount: float

class BudgetCreate(BudgetBase):
    date: datetime.date
    amount: float

class BudgetSchema(BudgetBase):
    id: int
    owner_id: int
    amount: float


    model_config = ConfigDict(from_attributes=True)