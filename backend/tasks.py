from datetime import date
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session
from models.transaction import Expense, RecurringExpense

def process_recurring_expenses(SessionLocal):
    session: Session = SessionLocal()
    today = date.today()
    try:
        due_items = (
            session.query(RecurringExpense)
           .filter(RecurringExpense.next_due_date <= today)
           .order_by(RecurringExpense.next_due_date) 
           .all()
)

        for item in due_items:
            tx = Expense(
                owner_id    = item.owner_id,
                category_id = item.category_id,
                amount      = item.amount,
                date        = item.next_due_date,
                description = f"{item.description}",
            )
            session.add(tx)

            freq = item.frequency.lower()
            delta = {
                "daily":   relativedelta(days=1),
                "weekly":  relativedelta(weeks=1),
                "monthly": relativedelta(months=1),
            }.get(freq)

            if not delta:
                continue

            next_date = item.next_due_date
            while next_date <= today:
                next_date += delta
            item.next_due_date = next_date

        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()
