import pytest
from pydantic import ValidationError

from schemas.expense_category import (
    ExpenseCategoryBase,
    ExpenseCategoryCreate,
    ExpenseCategorySchema,
)

def test_expense_category_base_defaults():
    obj = ExpenseCategoryBase(name="Food")
    assert obj.name == "Food"
    assert obj.color == "#FFFFFF"
    assert obj.icon == "fas fa-question-circle"

def test_expense_category_base_custom_values():
    obj = ExpenseCategoryBase(name="Travel", color="#FF0000", icon="fas fa-plane")
    assert obj.name == "Travel"
    assert obj.color == "#FF0000"
    assert obj.icon == "fas fa-plane"

def test_expense_category_create_inherits_base():
    obj = ExpenseCategoryCreate(name="Bills", color="#00FF00", icon="fas fa-bolt")
    assert isinstance(obj, ExpenseCategoryBase)
    assert obj.name == "Bills"
    assert obj.color == "#00FF00"
    assert obj.icon == "fas fa-bolt"

def test_expense_category_schema_fields():
    data = {
        "id": 1,
        "name": "Groceries",
        "owner_id": 42,
        "color": "#123456",
        "icon": "fas fa-shopping-cart"
    }
    obj = ExpenseCategorySchema(**data)
    assert obj.id == 1
    assert obj.name == "Groceries"
    assert obj.owner_id == 42
    assert obj.color == "#123456"
    assert obj.icon == "fas fa-shopping-cart"

def test_expense_category_schema_missing_fields():
    with pytest.raises(ValidationError):
        ExpenseCategorySchema(name="Groceries", owner_id=1, color="#000", icon="fas fa-x")  # missing id

def test_expense_category_base_missing_name():
    with pytest.raises(ValidationError):
        ExpenseCategoryBase()