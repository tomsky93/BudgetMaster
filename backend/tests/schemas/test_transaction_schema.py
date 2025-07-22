import pytest
from datetime import date
from pydantic_core import ValidationError
from schemas.transaction import RecurringExpenseCreate, RecurringExpenseResponse

def test_recurring_expense_create_valid():
    data = {
        "description": "Gym Membership",
        "amount": 49.99,
        "category_id": 1,
        "frequency": "monthly",
        "next_due_date": date(2024, 7, 1)
    }
    expense = RecurringExpenseCreate(**data)
    assert expense.description == "Gym Membership"
    assert expense.amount == 49.99
    assert expense.category_id == 1
    assert expense.frequency == "monthly"
    assert expense.next_due_date == date(2024, 7, 1)

@pytest.mark.parametrize("field,value", [
    ("description", None),
    ("amount", None),
    ("category_id", None),
    ("frequency", None),
    ("next_due_date", None),
])
def test_recurring_expense_create_missing_required(field, value):
    data = {
        "description": "Netflix",
        "amount": 15.0,
        "category_id": 2,
        "frequency": "monthly",
        "next_due_date": date(2024, 7, 2)
    }
    data[field] = value
    with pytest.raises(ValidationError):
        RecurringExpenseCreate(**data)

def test_recurring_expense_response_valid():
    data = {
        "description": "Spotify",
        "amount": 9.99,
        "category_id": 3,
        "frequency": "monthly",
        "next_due_date": date(2024, 7, 3),
        "id": 10,
        "owner_id": 5,
        "category_name": "Entertainment"
    }
    response = RecurringExpenseResponse(**data)
    assert response.id == 10
    assert response.owner_id == 5
    assert response.category_name == "Entertainment"
    assert response.description == "Spotify"

def test_recurring_expense_response_missing_extra_fields():
    data = {
        "description": "Spotify",
        "amount": 9.99,
        "category_id": 3,
        "frequency": "monthly",
        "next_due_date": date(2024, 7, 3),
       
    }
    with pytest.raises(ValidationError):
        RecurringExpenseResponse(**data)