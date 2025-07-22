from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from models.transaction import Expense, Income, SavingContribution
from models.expense_category import ExpenseCategory
from models.user import User
from models.budget import Budget
from schemas.expense_aggregated import AggregatedExpensesResponse, MonthlyAggregate
from dependencies import get_db
from services.auth import get_current_user
from typing import Optional, List

router = APIRouter()


@router.get("/aggregate-expenses", response_model=list[AggregatedExpensesResponse])
def aggregate_expenses(
    year: int,
    month: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if month is not None:
        aggregated_data = (
            db.query(
                ExpenseCategory.id.label("id"),
                ExpenseCategory.name.label("category"),
                ExpenseCategory.color.label("color"),
                func.sum(Expense.amount).label("total")
            )
            .join(ExpenseCategory, Expense.category_id == ExpenseCategory.id)
            .filter(
                Expense.owner_id == current_user.id,
                extract("year", Expense.date) == year,
                extract("month", Expense.date) == month
            )
            .group_by(ExpenseCategory.id, ExpenseCategory.name, ExpenseCategory.color)
            .all()
        )
        return [
            {"id": cid, "category": cat, "color": col, "total": tot}
            for cid, cat, col, tot in aggregated_data
        ]

    else:
        rows = (
            db.query(
                ExpenseCategory.id.label("id"),
                ExpenseCategory.name.label("category"),
                ExpenseCategory.color.label("color"),
                extract("month", Expense.date).label("month"),
                func.sum(Expense.amount).label("total")
            )
            .join(ExpenseCategory, Expense.category_id == ExpenseCategory.id)
            .filter(
                Expense.owner_id == current_user.id,
                extract("year", Expense.date) == year
            )
            .group_by(
                ExpenseCategory.id,
                ExpenseCategory.name,
                ExpenseCategory.color,
                extract("month", Expense.date)
            )
            .all()
        )

        totals_map: dict[tuple[int, int], float] = {
            (cid, int(m)): float(tot)
            for cid, _, _, m, tot in rows
        }

        categories = db.query(
            ExpenseCategory.id, ExpenseCategory.name, ExpenseCategory.color
        ).all()

        result: list[dict] = []
        for cid, name, color in categories:
            for m in range(1, 13):
                result.append({
                    "month": m,
                    "id": cid,
                    "category": name,
                    "color": color,
                    "total": totals_map.get((cid, m), 0.0)
                })

        result.sort(key=lambda x: (x["month"], x["category"]))
        return result


@router.get("/aggregate-expenses/all", response_model=List[MonthlyAggregate])
def aggregate_all_by_month(
    year: int,
    month: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    def _aggregate(model):
        q = (
            db.query(
                extract('month', model.date).label('month'),
                func.coalesce(func.sum(model.amount), 0).label('total')
            )
            .filter(
                model.owner_id == current_user.id,
                extract('year', model.date) == year
            )
        )
        if month is not None:
            q = q.filter(extract('month', model.date) == month)
        return dict(q.group_by(extract('month', model.date))
                     .order_by(extract('month', model.date))
                     .all())

    expenses = _aggregate(Expense)
    budgets = _aggregate(Budget)
    incomes = _aggregate(Income)
    savings = _aggregate(SavingContribution)

    all_months = sorted(set(expenses) | set(budgets) | set(incomes))

    result = []
    for m in all_months:
        result.append({
            "month": m,
            "expenses_total": expenses.get(m, 0.0),
            "budgets_total":  budgets.get(m, 0.0),
            "incomes_total":  incomes.get(m, 0.0),
            "savings_total":  savings.get(m, 0.0),
            "remaining_budget": budgets.get(m, 0.0) - expenses.get(m, 0.0),
        })

    return result
