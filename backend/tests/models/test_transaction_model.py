import pytest
from sqlalchemy import inspect
from models.transaction import Transaction, Expense, Income, IncomeCategoryEnum, SavingGoal, SavingContribution, RecurringExpense
from models.expense_category import ExpenseCategory
from datetime import date
import datetime

def test_transaction_mixin_fields():
    fields = Transaction.__dict__
    assert "id" in fields
    assert "description" in fields
    assert "amount" in fields
    assert "owner_id" in fields
    assert "date" in fields


def test_recurring_expense_inherits_transaction_mixin():
    fields = RecurringExpense.__dict__
    for attr in ["id", "description", "amount", "owner_id", "date"]:
        assert attr in fields or hasattr(RecurringExpense, attr)


def test_expense_model_tablename():
    assert Expense.__tablename__ == "expenses"


def test_expense_model_fields():
    test_date = datetime.date(2025, 3, 22)
    expense = Expense(
        description="Coffee",
        amount=3.25,
        owner_id=2,
        category_id=3,
        date=test_date
    )
    assert expense.description == "Coffee"
    assert expense.amount == 3.25
    assert expense.owner_id == 2
    assert expense.date == test_date
    assert expense.category_id == 3


def test_expense_model_relationships_initially_none():
    expense = Expense(
        description="Dinner",
        amount=20.0,
        owner_id=3,
        category_id=4
    )
    assert expense.owner is None
    assert expense.category is None


def test_create_expense_with_category(db_session, user):
    cat = ExpenseCategory(name="Food", owner_id=user.id)
    db_session.add(cat)
    db_session.commit()
    db_session.refresh(cat)

    exp = Expense(
        owner_id=user.id,
        category_id=cat.id,
        description="Lunch at cafe",
        amount=25.50,
        date=date(2025, 4, 20),
    )
    db_session.add(exp)
    db_session.commit()
    db_session.refresh(exp)

    assert exp.id is not None
    assert exp.owner_id == user.id
    assert exp.category_id == cat.id

    assert exp.owner.id == user.id

    assert exp.category.id == cat.id

    assert exp.category_name == "Food"
    assert exp.category_icon == cat.icon


def test_changing_category_reflects_in_properties(db_session, user):
    cat1 = ExpenseCategory(
        name="Transport", owner_id=user.id, icon="icon-trans")
    cat2 = ExpenseCategory(name="Entertainment",
                           owner_id=user.id, icon="icon-ent")
    db_session.add_all([cat1, cat2])
    db_session.commit()
    db_session.refresh(cat1)
    db_session.refresh(cat2)

    exp = Expense(
        owner_id=user.id,
        category_id=cat1.id,
        description="Bus ticket",
        amount=2.75,
        date=date(2025, 4, 22),
    )
    db_session.add(exp)
    db_session.commit()
    db_session.refresh(exp)

    assert exp.category_name == "Transport"
    assert exp.category_icon == "icon-trans"

    exp.category_id = cat2.id
    db_session.commit()
    db_session.refresh(exp)

    assert exp.category_name == "Entertainment"
    assert exp.category_icon == "icon-ent"

def test_income_category_enum_values():
    assert IncomeCategoryEnum.salary.value == "Salary"
    assert IncomeCategoryEnum.interests.value == "Interests"
    assert IncomeCategoryEnum.rent.value == "Rent"
    assert IncomeCategoryEnum.investments.value == "Investments"
    assert IncomeCategoryEnum.other.value == "Other"

def test_income_model_tablename():
    assert Income.__tablename__ == "incomes"

def test_income_model_fields():
    test_date = datetime.date(2025, 5, 22)
    income = Income(
        description="Salary for May",
        amount=5000.00,
        date=test_date,
        category=IncomeCategoryEnum.salary.value
    )
    
    assert income.description == "Salary for May"
    assert income.amount == 5000.00
    assert income.date == test_date
    assert income.category == IncomeCategoryEnum.salary.value

def test_income_category_column_default():
    mapper = inspect(Income)
    category_col = mapper.columns['category']
    assert category_col.default is not None
    assert category_col.default.arg == IncomeCategoryEnum.other.value

def test_defaults(db_session, user):
    goal = SavingGoal(
        title="My goal",
        target_amount=1000.0,
        deadline=date(2025, 12, 31),
        owner_id=user.id
    )

    db_session.add(goal)
    db_session.commit()
    db_session.refresh(goal)

    assert goal.icon == "fas fa-question-circle"


def test_progress_percent_zero_target():
    goal = SavingGoal(
        title="Goal with zero target",
        target_amount=0.0,
        deadline=date.today()
    )
    assert goal.progress_percent == 0


def test_progress_percent_full():
    goal = SavingGoal(
        title="Full goal",
        target_amount=500.0,
        deadline=date.today(),
        owner_id=1,
    )
    goal.contributions.append(SavingContribution(amount=500.0))
    assert pytest.approx(goal.progress_percent, rel=1e-3) == 100.0


def test_progress_percent_partial():
    goal = SavingGoal(
        title="Partial goal",
        target_amount=1000.0,
        deadline=date.today(),
        owner_id=1,
    )
    goal.contributions.append(SavingContribution(amount=250.0))
    assert pytest.approx(goal.progress_percent, rel=1e-3) == 25.0


def test_update_current_amount():
    goal = SavingGoal(
        title="Update current amount",
        target_amount=200.0,
        deadline=date.today(),
        owner_id=1,
    )

    goal.contributions.append(SavingContribution(amount=123.45))
    assert pytest.approx(goal.current_amount, rel=1e-3) == 123.45


def test_deadline_field():
    d = date(2026, 1, 1)
    goal = SavingGoal(
        title="Deadline test",
        target_amount=500.0,
        deadline=d
    )
    assert goal.deadline == d


def test_owner_assignment(user):
    goal = SavingGoal(
        title="Owner assignment",
        target_amount=800.0,
        deadline=date.today()
    )
    goal.owner = user
    assert goal.owner == user
