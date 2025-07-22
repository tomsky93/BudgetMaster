import pytest
from sqlalchemy.exc import IntegrityError
from models.expense_category import ExpenseCategory


def test_create_expense_category_success(db_session, user):
    cat = ExpenseCategory(name="Food", owner_id=user.id)
    db_session.add(cat)
    db_session.commit()
    db_session.refresh(cat)

    assert cat.id is not None
    assert cat.name == "Food"
    assert cat.owner_id == user.id

    assert cat.color == "#FFFFFF"
    assert cat.icon == "fas fa-question-circle"

def test_create_with_custom_color_and_icon(db_session, user):
    custom_color = "#FF0000"
    custom_icon = "fas fa-utensils"
    cat = ExpenseCategory(
        name="Dining Out",
        owner_id=user.id,
        color=custom_color,
        icon=custom_icon
    )
    db_session.add(cat)
    db_session.commit()
    db_session.refresh(cat)

    assert cat.color == custom_color
    assert cat.icon == custom_icon

def test_multiple_categories_same_name_and_owner_ok(db_session, user):
    cat1 = ExpenseCategory(name="Transport", owner_id=user.id)
    cat2 = ExpenseCategory(name="Transport", owner_id=user.id)
    db_session.add_all([cat1, cat2])
    
    db_session.commit()

    assert cat1.id is not None
    assert cat2.id is not None
    assert cat1.id != cat2.id

def test_missing_owner_id_allowed(db_session):
    cat = ExpenseCategory(name="Misc")
    db_session.add(cat)
    db_session.commit()
    db_session.refresh(cat)

    assert cat.id is not None
    assert cat.owner_id is None
    
    assert cat.color == "#FFFFFF"
    assert cat.icon == "fas fa-question-circle"

def test_missing_name_allowed(db_session, user):
    cat = ExpenseCategory(owner_id=user.id)
    db_session.add(cat)
    db_session.commit()
    db_session.refresh(cat)

    assert cat.id is not None
    assert cat.name is None
    assert cat.owner_id == user.id

def test_color_column_length_stored_as_is(db_session, user):
    long_color = "#12345678ABC"
    cat = ExpenseCategory(name="TestColor", owner_id=user.id, color=long_color)
    db_session.add(cat)
    db_session.commit()
    db_session.refresh(cat)

    assert cat.color == long_color
    assert len(cat.color) == len(long_color)


def test_icon_column_length_stored_as_is(db_session, user):
    long_icon = "a" * 60
    cat = ExpenseCategory(name="TestIcon", owner_id=user.id, icon=long_icon)
    db_session.add(cat)
    db_session.commit()
    db_session.refresh(cat)

    assert cat.icon == long_icon
    assert len(cat.icon) == len(long_icon)
