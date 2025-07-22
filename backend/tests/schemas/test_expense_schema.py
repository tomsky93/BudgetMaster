import datetime
import pytest
from pydantic import ValidationError
from schemas.transaction import ExpenseBase, ExpenseCreate, ExpenseSchema

def test_expense_base_valid():
    data = {"description": "Lunch", "amount": 12.5}
    expense = ExpenseBase(**data)
    assert expense.description == "Lunch"
    assert expense.amount == 12.5

def test_expense_base_invalid_amount():
    with pytest.raises(ValidationError):
        ExpenseBase(description="Dinner", amount="not_a_float")

def test_expense_create_valid():
    data = {
        "description": "Taxi",
        "amount": 20.0,
        "category_id": 2,
        "date": datetime.date(2024, 6, 1)
    }
    expense = ExpenseCreate(**data)
    assert expense.category_id == 2
    assert expense.date == datetime.date(2024, 6, 1)

def test_expense_create_missing_field():
    data = {
        "description": "Taxi",
        "amount": 20.0,
        "date": datetime.date(2024, 6, 1)
    }
    with pytest.raises(ValidationError):
        ExpenseCreate(**data)

def test_expense_schema_valid():
    data = {
        "id": 1,
        "owner_id": 10,
        "category_id": 3,
        "category_name": "Transport",
        "date": datetime.date(2024, 6, 2),
        "description": "Bus ticket",
        "amount": 2.5,
        "category_icon": "bus"
    }
    expense = ExpenseSchema(**data)
    assert expense.id == 1
    assert expense.owner_id == 10
    assert expense.category_name == "Transport"
    assert expense.category_icon == "bus"

def test_expense_schema_missing_required():
    data = {
        "id": 1,
        "owner_id": 10,
        "category_id": 3,
        "category_name": "Transport",
        "date": datetime.date(2024, 6, 2),
        "description": "Bus ticket",
        "category_icon": "bus"
    }
    with pytest.raises(ValidationError):
        ExpenseSchema(**data)