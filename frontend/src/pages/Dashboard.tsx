import React from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import ExpenseList from "../components/ExpenseList";
import IncomeList from "../pages/IncomeList";
import AggregateExpensesByYear from "../components/TotalExpense";
import ExpensesByCategory from "../components/TotalExpenseCategory";
import { DateNavigator } from "../components/DateNavigator";
import SavingGoalsList from "../components/SavingGoalsList";
import RecurringExpenses from "../components/RecurringExpenses";

const Dashboard: React.FC = () => {

  return (
    <div>
      <ConfirmDialog />
      <div className="card p-2.5 screen">
        <DateNavigator>
          {({ year, month }) => (
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6">
              <div className="md:col-span-3 flex flex-col space-y-4">
                <ExpensesByCategory year={year} month={month} />
                <SavingGoalsList></SavingGoalsList>
              </div>
              <div className="md:col-span-4 flex flex-col space-y-4">
                <AggregateExpensesByYear year={year} month={month} />
                <ExpenseList year={year} month={month} />
              </div>
              <div className="md:col-span-3 flex flex-col space-y-4">
                <IncomeList year={year} month={month} />
                <></>
                <RecurringExpenses year={year} month={month}/>
              </div>
            </div>
          )}
        </DateNavigator>
      </div>
    </div>
  );
};

export default Dashboard;
