from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class ExpenseCategory(Base):
    __tablename__ = "expense_categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    expenses = relationship("Expense", back_populates="category")
    recurring_expenses = relationship(
        "RecurringExpense", back_populates="category")
    color = Column(
        String(7),
        nullable=False,
        server_default="#FFFFFF",
        default="#FFFFFF"
    )

    icon = Column(
        String(50),
        nullable=False,
        server_default="fas fa-question-circle",
        default="fas fa-question-circle"
    )
