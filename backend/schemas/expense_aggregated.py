from pydantic import BaseModel, ConfigDict

class ExpenseAggregateSchema(BaseModel):
    category: str
    color: str
    total_amount: float
    model_config = ConfigDict(from_attributes=True)
    
class AggregatedExpensesBase(BaseModel):
    category: str
    color: str
    total: float

class AggregatedExpensesResponse(AggregatedExpensesBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
    

class MonthlyAggregate(BaseModel):
    month: int
    expenses_total: float
    budgets_total: float
    incomes_total: float
    savings_total: float
    remaining_budget: float