from sqlalchemy import Column, Integer, Date, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class Budget(Base):
    __tablename__ = "budget"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True, nullable=False)
    amount = Column(Float, default=0.0, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="budget")

    __table_args__ = (UniqueConstraint(
        "owner_id", "date", name="_owner_date_uc"),)
