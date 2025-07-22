from pydantic import BaseModel
from datetime import date
from typing import List, Optional
from pydantic import ConfigDict
from enum import Enum
from pydantic import BaseModel
import datetime

class ExpenseBase(BaseModel):
    description: str
    amount: float

class ExpenseCreate(ExpenseBase):
    category_id: int 
    date: datetime.date

class ExpenseSchema(BaseModel):
    id: int
    owner_id: int
    category_id: int
    category_name: str 
    date: datetime.date  
    description: str
    amount: float
    category_icon: str
    model_config = ConfigDict(from_attributes=True)

class IncomeCategoryEnum(str, Enum):
    salary = "Salary"
    interests = "Interests"
    investments = "Investments"
    rent = "Rent"
    other = "Other"

class IncomeCreate(BaseModel):
    description: str
    amount: float
    date: datetime.date = datetime.date.today()
    category: IncomeCategoryEnum

class IncomeSchema(BaseModel):
    id: int 
    description: str
    amount: float
    owner_id: int
    date: datetime.date
    category: IncomeCategoryEnum

    model_config = ConfigDict(from_attributes=True)

class SavingGoalBase(BaseModel):
    title: str
    target_amount: float
    deadline: datetime.date

class SavingGoalCreate(SavingGoalBase):
    icon: str = "fas fa-question-circle"  
    owner_id: int
        
class SavingGoalSchema(SavingGoalBase):
    id: int
    owner_id: int
    icon: str
    progress_percent: float
    current_amount: float
    
    model_config = ConfigDict(from_attributes=True)
    
class SavingContributionCreate(BaseModel):
    saving_goal_id: int
    amount: float
    date: date
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class SavingContributionCreate(BaseModel):
    saving_goal_id: int
    amount: float
    date: date
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class SavingContributionRead(SavingContributionCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)

class RecurringExpenseCreate(BaseModel):
    description: str
    amount: float
    category_id: int
    frequency: str
    next_due_date: date

    model_config = ConfigDict(from_attributes=True)


class RecurringExpenseResponse(RecurringExpenseCreate):
    id: int
    owner_id: int
    category_name: str

class RecurringExpenseInstance(BaseModel):
    id:            int
    description:   str
    amount:        float
    category_name: str
    date:          date

    model_config = ConfigDict(from_attributes=True)


class RecurringExpenseMonthResponse(BaseModel):
    instances:    List[RecurringExpenseInstance]
    total_amount: float

    model_config = ConfigDict(from_attributes=True)
