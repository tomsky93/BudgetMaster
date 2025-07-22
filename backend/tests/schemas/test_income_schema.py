import pytest
import datetime
from pydantic import ValidationError
from schemas.transaction import IncomeCategoryEnum, IncomeCreate, IncomeSchema

def test_income_category_enum_values():
    assert IncomeCategoryEnum.salary == "Salary"
    assert IncomeCategoryEnum.interests == "Interests"
    assert IncomeCategoryEnum.rent == "Rent"
    assert IncomeCategoryEnum.other == "Other"

def test_income_create_valid():
    data = {
        "description": "Monthly Salary",
        "amount": 5000.0,
        "date": datetime.date(2024, 6, 1),
        "category": "Salary"
    }
    income = IncomeCreate(**data)
    assert income.description == "Monthly Salary"
    assert income.amount == 5000.0
    assert income.date == datetime.date(2024, 6, 1)
    assert income.category == IncomeCategoryEnum.salary

def test_income_create_default_date():
    income = IncomeCreate(description="Gift", amount=100.0, category="Other")
    assert isinstance(income.date, datetime.date)

def test_income_create_invalid_category():
    with pytest.raises(ValidationError):
        IncomeCreate(amount=100.0, category="invalid")

def test_income_create_missing_amount():
    with pytest.raises(ValidationError):
        IncomeCreate(category="Salary")

def test_income_schema_valid():
    data = {
        "id": 1,
        "description": "Interest income",
        "amount": 200.0,
        "owner_id": 42,
        "date": datetime.date(2024, 5, 20),
        "category": "Interests"
    }
    schema = IncomeSchema(**data)
    assert schema.id == 1
    assert schema.description == "Interest income"
    assert schema.amount == 200.0
    assert schema.owner_id == 42
    assert schema.date == datetime.date(2024, 5, 20)
    assert schema.category == IncomeCategoryEnum.interests

def test_income_schema_missing_required_fields():
        with pytest.raises(ValidationError):
            IncomeSchema(
                id=1,
                description="No owner",
                amount=10.0,
                date=datetime.date.today(),
                category="Salary"
            )

        with pytest.raises(ValidationError):
            IncomeSchema(
                id=1,
                description="No date",
                amount=10.0,
                owner_id=1,
                category="Salary"
            )

        with pytest.raises(ValidationError):
            IncomeSchema(
                id=1,
                description="No category",
                amount=10.0,
                owner_id=1,
                date=datetime.date.today()
            )