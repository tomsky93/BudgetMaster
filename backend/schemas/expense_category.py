    
from pydantic import BaseModel, ConfigDict

class ExpenseCategoryBase(BaseModel):
    name: str
    color: str = "#FFFFFF"
    icon: str = "fas fa-question-circle"

class ExpenseCategoryCreate(ExpenseCategoryBase):
    pass

class ExpenseCategorySchema(BaseModel):
    id: int
    name: str
    owner_id: int
    color: str
    icon: str
    model_config = ConfigDict(from_attributes=True)
