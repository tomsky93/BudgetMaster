from sqlalchemy.orm import Session
from services.base_crud_service import BaseCRUDService
from models.transaction import RecurringExpense
from datetime import date
from calendar import monthrange
from dateutil.rrule import rrule, DAILY, WEEKLY, MONTHLY

FREQ_MAP = {
    "daily": DAILY,
    "weekly": WEEKLY,
    "monthly": MONTHLY,
}


class RecurringExpenseService(BaseCRUDService):
    def __init__(self, db: Session):
        from models.transaction import RecurringExpense
        super().__init__(RecurringExpense, db)

    def list_instances_for_month(self, user_id: int, year: int, month: int):
        start = date(year, month, 1)
        last_day = monthrange(year, month)[1]
        end = date(year, month, last_day)

        rules: list[RecurringExpense] = (
            self.db.query(RecurringExpense)
                .filter_by(owner_id=user_id)
                .all()
        )

        instances = []
        counter = 1
        for rule in rules:
            freq = FREQ_MAP.get(rule.frequency)
            if not freq:
                continue

            for occ in rrule(freq, dtstart=rule.next_due_date, until=end):
                if occ.date() < start:
                    continue
                instances.append({
                    "id":            counter,
                    "description":   rule.description,
                    "amount":        rule.amount,
                    "category_name": rule.category_name,
                    "date":          occ.date(),
                })
                counter += 1
            instances.sort(key=lambda x: x["date"])

        total_amount = sum(item["amount"] for item in instances)

        return {
            "instances": instances,
            "total_amount": total_amount
        }
