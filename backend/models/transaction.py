from enum import Enum
import datetime
from sqlalchemy import (
    Column, Integer, Float, String, Date, Enum as SQLEnum,
    ForeignKey
)
from sqlalchemy.orm import relationship
from database import Base


class TransactionType(str, Enum):
    EXPENSE = "expense"
    INCOME = "income"
    SAVING_CONTRIBUTION = "saving"
    RECURRING_EXPENSE = "recurring_expense"


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(Date, default=datetime.date.today, nullable=False)
    description = Column(String)
    type = Column(SQLEnum(TransactionType), nullable=False)

    __mapper_args__ = {
        "polymorphic_on": type,
        "polymorphic_identity": None,
    }

    owner = relationship("User", back_populates="transactions")


class Expense(Transaction):
    __tablename__ = "expenses"
    id = Column(Integer, ForeignKey("transactions.id"), primary_key=True)
    category_id = Column(Integer, ForeignKey(
        "expense_categories.id"), nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": TransactionType.EXPENSE,
    }

    category = relationship("ExpenseCategory", back_populates="expenses")

    @property
    def category_name(self):
        return self.category.name

    @property
    def category_icon(self):
        return self.category.icon


class RecurringExpense(Transaction):
    __tablename__ = "recurring_expenses"
    id = Column(Integer, ForeignKey("transactions.id"), primary_key=True)
    category_id = Column(Integer, ForeignKey(
        "expense_categories.id"), nullable=False)
    frequency = Column(String, nullable=False)
    next_due_date = Column(Date, nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": TransactionType.RECURRING_EXPENSE,
    }

    category = relationship(
        "ExpenseCategory", back_populates="recurring_expenses")

    @property
    def category_name(self):
        return self.category.name


class IncomeCategoryEnum(str, Enum):
    salary = "Salary"
    interests = "Interests"
    rent = "Rent"
    investments = "Investments"
    other = "Other"


class Income(Transaction):
    __tablename__ = "incomes"
    id = Column(Integer, ForeignKey("transactions.id"), primary_key=True)
    category = Column(
        String,
        nullable=False,
        default=IncomeCategoryEnum.other.value
    )

    __mapper_args__ = {
        "polymorphic_identity": TransactionType.INCOME,
    }


class SavingContribution(Transaction):
    __tablename__ = "saving_contributions"
    id = Column(Integer, ForeignKey("transactions.id"), primary_key=True)
    saving_goal_id = Column(Integer, ForeignKey(
        "saving_goals.id"), nullable=False)

    __mapper_args__ = {
        "polymorphic_identity": TransactionType.SAVING_CONTRIBUTION,
    }

    saving_goal = relationship("SavingGoal", back_populates="contributions")


class SavingGoal(Base):
    __tablename__ = "saving_goals"
    id = Column(Integer, primary_key=True)
    title = Column(String,  nullable=False)
    target_amount = Column(Float,   nullable=False)
    deadline = Column(Date)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="saving_goals")

    icon = Column(
        String(50),
        nullable=False,
        server_default="fas fa-question-circle",
        default="fas fa-question-circle",
    )

    contributions = relationship(
        "SavingContribution",
        back_populates="saving_goal",
        cascade="all, delete-orphan"
    )

    @property
    def current_amount(self):
        return sum(c.amount for c in self.contributions)

    @property
    def progress_percent(self):
        return round(self.current_amount / self.target_amount * 100, 2) if self.target_amount else 0
