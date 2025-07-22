import pytest
from datetime import date, timedelta
import tasks
from conftest import TestingSessionLocal
from models.transaction import RecurringExpense, Expense

@pytest.mark.parametrize("freq, delta_days", [
    ('daily', 1),
    ('weekly', 7),
    ('monthly', None), 
])
def test_recurring_updates_and_creates_expense(db_session, monkeypatch, freq, delta_days):
    fixed_today = date(2025, 7, 14)
    class FakeDate(date):
        @classmethod
        def today(cls):
            return fixed_today
    monkeypatch.setattr(tasks, 'date', FakeDate)

    if delta_days is not None:
        initial_due = fixed_today - timedelta(days=delta_days)
    else:
        month = fixed_today.month - 1 or 12
        year = fixed_today.year - (1 if fixed_today.month == 1 else 0)
        initial_due = fixed_today.replace(year=year, month=month)

    rec = RecurringExpense(
        owner_id=1,
        category_id=1,
        amount=100,
        next_due_date=initial_due,
        frequency=freq,
        description=f"Test {freq}"
    )
    db_session.add(rec)
    db_session.commit()

    tasks.process_recurring_expenses(TestingSessionLocal)

    session = TestingSessionLocal()
    expenses = session.query(Expense).all()
    assert len(expenses) == 1, f"Expected 1 expense for freq {freq}, got {len(expenses)}"
    assert expenses[0].date == initial_due

    updated = session.query(RecurringExpense).first()
    if delta_days is not None:
        expected_next = fixed_today + timedelta(days=delta_days)
    else:
        month = fixed_today.month + 1 if fixed_today.month < 12 else 1
        year = fixed_today.year + (1 if month == 1 else 0)
        expected_next = fixed_today.replace(year=year, month=month)

    assert updated.next_due_date == expected_next, (
        f"For freq {freq}, expected next_due_date {expected_next}, got {updated.next_due_date}"
    )
    session.close()


def test_unknown_frequency_creates_expense_but_does_not_update_next_due_date(db_session, monkeypatch):
    fixed_today = date(2025, 7, 14)
    class FakeDate(date):
        @classmethod
        def today(cls):
            return fixed_today
    monkeypatch.setattr(tasks, 'date', FakeDate)

    initial_due = fixed_today - timedelta(days=3)
    rec = RecurringExpense(
        owner_id=2,
        category_id=2,
        amount=75,
        next_due_date=initial_due,
        frequency='unknown',
        description='Unknown freq'
    )
    db_session.add(rec)
    db_session.commit()

    tasks.process_recurring_expenses(TestingSessionLocal)

    session = TestingSessionLocal()
    expenses = session.query(Expense).filter(Expense.owner_id == 2).all()
    assert len(expenses) == 1
    assert expenses[0].date == initial_due

    updated = session.query(RecurringExpense).filter(RecurringExpense.owner_id == 2).first()
    assert updated.next_due_date == initial_due
    session.close()


def test_catch_up_advances_multiple_intervals(db_session, monkeypatch):
    fixed_today = date(2025, 7, 14)
    class FakeDate(date):
        @classmethod
        def today(cls):
            return fixed_today
    monkeypatch.setattr(tasks, 'date', FakeDate)

    initial_due = fixed_today - timedelta(weeks=2)
    rec = RecurringExpense(
        owner_id=3,
        category_id=3,
        amount=200,
        next_due_date=initial_due,
        frequency='weekly',
        description='Catch up'
    )
    db_session.add(rec)
    db_session.commit()

    tasks.process_recurring_expenses(TestingSessionLocal)

    session = TestingSessionLocal()
    updated = session.query(RecurringExpense).filter(RecurringExpense.owner_id == 3).first()
    expected_next = fixed_today + timedelta(weeks=1)
    assert updated.next_due_date == expected_next
    session.close()


def test_monthly_edge_case_february_short_month(db_session, monkeypatch):
    fixed_today = date(2025, 2, 15)
    class FakeDate(date):
        @classmethod
        def today(cls):
            return fixed_today
    monkeypatch.setattr(tasks, 'date', FakeDate)

    initial_due = date(2025, 1, 31)
    rec = RecurringExpense(
        owner_id=4,
        category_id=4,
        amount=150,
        next_due_date=initial_due,
        frequency='monthly',
        description='End-of-month'
    )
    db_session.add(rec)
    db_session.commit()

    tasks.process_recurring_expenses(TestingSessionLocal)

    session = TestingSessionLocal()
    expenses = session.query(Expense).filter(Expense.owner_id == 4).all()
   
    assert len(expenses) == 1
    assert expenses[0].date == initial_due
    updated = session.query(RecurringExpense).filter(RecurringExpense.owner_id == 4).first()
   
    assert updated.next_due_date == date(2025, 2, 28)
    session.close()


def test_monthly_edge_case_30_day_month(db_session, monkeypatch):
    fixed_today = date(2025, 4, 10)
    class FakeDate(date):
        @classmethod
        def today(cls):
            return fixed_today
    monkeypatch.setattr(tasks, 'date', FakeDate)

    initial_due = date(2025, 3, 31)
    rec = RecurringExpense(
        owner_id=5,
        category_id=5,
        amount=175,
        next_due_date=initial_due,
        frequency='monthly',
        description='EOM April'
    )
    db_session.add(rec)
    db_session.commit()

    tasks.process_recurring_expenses(TestingSessionLocal)

    session = TestingSessionLocal()
    expenses = session.query(Expense).filter(Expense.owner_id == 5).all()

    assert len(expenses) == 1
    assert expenses[0].date == initial_due
    updated = session.query(RecurringExpense).filter(RecurringExpense.owner_id == 5).first()

    assert updated.next_due_date == date(2025, 4, 30)
    session.close()
