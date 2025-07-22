import pytest
from datetime import date
from sqlalchemy.exc import IntegrityError
from models.user import User
from models.transaction import Expense, SavingGoal, RecurringExpense
from models.budget import Budget

def test_user_defaults(db_session, user):
    assert user.id is not None
    assert user.currency == "USD"
    assert user.locale == "en-US"

def test_username_unique_constraint(db_session):
    u1 = User(username="bob", hashed_password="h1")
    db_session.add(u1)
    db_session.commit()

    u2 = User(username="bob", hashed_password="h2")
    db_session.add(u2)
    with pytest.raises(IntegrityError):
        db_session.commit()

def test_user_expenses_relationship(db_session, user):
    
    expense = Expense(
        description="Test expense",
        amount=123.45,
        date=date(2025, 5, 1),
        category_id=1,
        owner=user
    )
    db_session.add(expense)
    db_session.commit()
    db_session.refresh(user)

    assert len(user.expenses) == 1
    assert user.expenses[0] is expense
    assert expense.owner is user


def test_user_budget_relationship(db_session, user):
    budget = Budget(
        amount=1000.0,
        date=date(2025, 6, 1),
        owner=user
    )
    db_session.add(budget)
    db_session.commit()
    db_session.refresh(user)

    assert len(user.budget) == 1
    assert user.budget[0] is budget
    assert budget.owner is user

def test_user_recurring_expenses_relationship(db_session, user):
    recurring = RecurringExpense(
        description="Monthly subscription",
        amount=50.0,
        frequency="monthly",
        next_due_date=date(2025, 1, 1),
        category_id=1,
        owner=user
    )
    db_session.add(recurring)
    db_session.commit()
    db_session.refresh(user)

    assert len(user.recurring_expenses) == 1
    assert user.recurring_expenses[0] is recurring
    assert recurring.owner is user

def test_user_saving_goals_relationship(db_session, user):
    saving_goal = SavingGoal(
        title="Vacation Fund",
        target_amount=2000.0,
        deadline=date(2025, 12, 31),
        owner=user
    )
    db_session.add(saving_goal)
    db_session.commit()
    db_session.refresh(user)

    assert len(user.saving_goals) == 1
    assert user.saving_goals[0] is saving_goal
    assert saving_goal.owner is user
