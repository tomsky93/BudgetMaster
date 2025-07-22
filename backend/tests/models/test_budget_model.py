import pytest
from datetime import date
from sqlalchemy.exc import IntegrityError
from models.budget import Budget

def test_create_budget_success(db_session, user):
    b = Budget(owner_id=user.id, date=date(2025, 4, 1), amount=750.0)
    db_session.add(b)
    db_session.commit()

    assert b.id is not None

    fetched = db_session.query(Budget).filter_by(id=b.id).first()
    assert fetched is not None
    assert fetched.owner_id == user.id
    assert fetched.date == date(2025, 4, 1)
    assert fetched.amount == pytest.approx(750.0)


def test_unique_constraint_owner_date(db_session, user):
    b1 = Budget(owner_id=user.id, date=date(2025, 4, 1), amount=100.0)
    db_session.add(b1)
    db_session.commit()

    b2 = Budget(owner_id=user.id, date=date(2025, 4, 1), amount=200.0)
    db_session.add(b2)
    with pytest.raises(IntegrityError):
        db_session.commit()


def test_different_users_same_date_ok(db_session, user):
    from models.user import User
    u2 = User(username="otheruser", hashed_password="hash2", currency="EUR", locale="en-GB")
    db_session.add(u2)
    db_session.commit()
    db_session.refresh(u2)

    b1 = Budget(owner_id=user.id, date=date(2025, 5, 1), amount=300.0)

    b2 = Budget(owner_id=u2.id, date=date(2025, 5, 1), amount=400.0)
    db_session.add_all([b1, b2])

    db_session.commit()

    assert b1.id is not None
    assert b2.id is not None


def test_missing_owner_id_fails(db_session):
    b = Budget(date=date(2025, 6, 1), amount=123.0)
    db_session.add(b)
    with pytest.raises(IntegrityError):
        db_session.commit()


def test_missing_date_fails(db_session, user):
    b = Budget(owner_id=user.id, amount=50.0)
    db_session.add(b)
    with pytest.raises(IntegrityError):
        db_session.commit()


def test_default_amount_zero(db_session, user):
    b = Budget(owner_id=user.id, date=date(2025, 7, 1))
    db_session.add(b)
    db_session.commit()
    db_session.refresh(b)

    assert b.amount == pytest.approx(0.0)