from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id               = Column(Integer, primary_key=True, index=True)
    username         = Column(String, unique=True, index=True)
    hashed_password  = Column(String)
    currency         = Column(String(3),  nullable=False, default="USD")
    locale           = Column(String(10), nullable=False, default="en-US")
    budget = relationship("Budget", back_populates="owner")
    expenses            = relationship("Expense",             back_populates="owner")
    recurring_expenses  = relationship("RecurringExpense",    back_populates="owner")
    incomes             = relationship("Income",              back_populates="owner")
    saving_contributions= relationship("SavingContribution",  back_populates="owner")
    saving_goals        = relationship("SavingGoal",     back_populates="owner")

    transactions        = relationship(
                             "Transaction",
                             back_populates="owner",
                             viewonly=True
                         )