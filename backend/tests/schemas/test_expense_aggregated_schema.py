import pytest
from pydantic import ValidationError

from schemas.expense_aggregated import (
    ExpenseAggregateSchema,
    AggregatedExpensesBase,
    AggregatedExpensesResponse,
    MonthlyAggregate,
)

def test_expense_aggregate_schema_valid():
    data = {
        "category": "Food",
        "color": "#FF0000",
        "total_amount": 123.45
    }
    obj = ExpenseAggregateSchema(**data)
    assert obj.category == "Food"
    assert obj.color == "#FF0000"
    assert obj.total_amount == 123.45

def test_expense_aggregate_schema_missing_field():
    data = {
        "category": "Food",
        "color": "#FF0000"
    }
    with pytest.raises(ValidationError):
        ExpenseAggregateSchema(**data)

def test_aggregated_expenses_base_valid():
    data = {
        "category": "Transport",
        "color": "#00FF00",
        "total": 50.0
    }
    obj = AggregatedExpensesBase(**data)
    assert obj.category == "Transport"
    assert obj.color == "#00FF00"
    assert obj.total == 50.0

def test_aggregated_expenses_response_valid():
    data = {
        "category": "Bills",
        "color": "#0000FF",
        "total": 200.0,
        "id": 1
    }
    obj = AggregatedExpensesResponse(**data)
    assert obj.category == "Bills"
    assert obj.color == "#0000FF"
    assert obj.total == 200.0
    assert obj.id == 1

def test_aggregated_expenses_response_missing_id():
    data = {
        "category": "Bills",
        "color": "#0000FF",
        "total": 200.0
    }
    with pytest.raises(ValidationError):
        AggregatedExpensesResponse(**data)

def test_monthly_aggregate_valid():
    data = {
        "month": 6,
        "expenses_total": 1000.0,
        "budgets_total": 1200.0,
        "incomes_total": 1500.0,
        "savings_total": 300.0,
        "remaining_budget": 200.0
    }
    obj = MonthlyAggregate(**data)
    assert obj.month == 6
    assert obj.expenses_total == 1000.0
    assert obj.budgets_total == 1200.0
    assert obj.incomes_total == 1500.0
    assert obj.savings_total == 300.0
    assert obj.remaining_budget == 200.0

def test_monthly_aggregate_invalid_type():
    data = {
        "month": "June",
        "expenses_total": 1000.0,
        "budgets_total": 1200.0,
        "incomes_total": 1500.0,
        "remaining_budget": 200.0
    }
    with pytest.raises(ValidationError):
        MonthlyAggregate(**data)