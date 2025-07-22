import pytest
import datetime
from pydantic import ValidationError
from schemas.transaction import SavingGoalBase, SavingGoalCreate, SavingGoalSchema


def test_saving_goal_base_required_fields():
    with pytest.raises(ValidationError):
        SavingGoalBase(target_amount=100.0, deadline=datetime.date.today())


def test_saving_goal_create_default_icon_and_owner():
    obj = SavingGoalCreate(
        title="Test", target_amount=200.0,
        deadline=datetime.date(2025, 12, 31),
        owner_id=42
    )
    assert obj.icon == "fas fa-question-circle"
    assert obj.owner_id == 42


def test_saving_goal_schema_from_attributes():
    class Dummy:
        def __init__(self):
            self.id = 2
            self.title = "Test"
            self.target_amount = 200.0
            self.current_amount = 50.0
            self.deadline = datetime.date(2025, 1, 1)
            self.owner_id = 7
            self.icon = "icon-test"

        @property
        def progress_percent(self):
            return self.current_amount / self.target_amount * 100

    dummy = Dummy()
    schema = SavingGoalSchema.model_validate(dummy)
    assert schema.id == 2
    assert schema.title == "Test"
    assert schema.target_amount == pytest.approx(200.0)
    assert schema.current_amount == pytest.approx(50.0)
    assert schema.deadline == datetime.date(2025, 1, 1)
    assert schema.owner_id == 7
    assert schema.icon == "icon-test"
    assert schema.progress_percent == pytest.approx(25.0)
