import datetime
import pytest
from pydantic import ValidationError
from schemas.budget import BudgetBase, BudgetCreate, BudgetSchema

def test_budget_base_valid():
    data = {"date": datetime.date(2024, 6, 1), "amount": 100.0}
    budget = BudgetBase(**data)
    assert budget.date == data["date"]
    assert budget.amount == data["amount"]

def test_budget_base_invalid_amount():
    with pytest.raises(ValidationError):
        BudgetBase(date=datetime.date(2024, 6, 1), amount="not_a_float")

def test_budget_create_inherits_budget_base():
    data = {"date": datetime.date(2024, 6, 2), "amount": 200.0}
    budget = BudgetCreate(**data)
    assert isinstance(budget, BudgetBase)
    assert budget.date == data["date"]
    assert budget.amount == data["amount"]

def test_budget_schema_valid():
    data = {
        "id": 1,
        "owner_id": 42,
        "date": datetime.date(2024, 6, 3),
        "amount": 300.0,
    }
    budget = BudgetSchema(**data)
    assert budget.id == data["id"]
    assert budget.owner_id == data["owner_id"]
    assert budget.date == data["date"]
    assert budget.amount == data["amount"]

def test_budget_schema_missing_field():
    data = {
        "id": 1,
        "owner_id": 42,
        "date": datetime.date(2024, 6, 3),
    }
    with pytest.raises(ValidationError):
        BudgetSchema(**data)

def test_budget_schema_invalid_date():
    data = {
        "id": 1,
        "owner_id": 42,
        "date": "not_a_date",
        "amount": 100.0,
    }
    with pytest.raises(ValidationError):
        BudgetSchema(**data)
        
