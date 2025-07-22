import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../configApi";
import { MonthlyAggregate } from "../api/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Chart } from "primereact/chart";
import "chart.js/auto";
import { Money } from "./Money";
import { ProgressBarCard } from "./ProgressBarCard";
import { Tile } from "./Tile";
import IncomeForm from "../pages/forms/IncomeForm";
import ExpenseForm from "../pages/forms/ExpenseForm";
import BudgetForm from "../pages/forms/BudgetForm";
import { ProgressSpinner } from "primereact/progressspinner";

type Props = Parameters<
  typeof api.aggregateExpenses.aggregateAllByMonthAggregateExpensesAllGet
>[0];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AggregateExpensesByYear: React.FC<Props> = ({ year, month }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeForm, setActiveForm] = useState<
    "income" | "expense" | "budget" | null
  >(null);

  const openForm = (type: "income" | "expense" | "budget") => {
    setActiveForm(type);
    setShowModal(true);
  };
  const closeForm = () => {
    setShowModal(false);
    setActiveForm(null);
  };

  const { data, isLoading } = useQuery<MonthlyAggregate[]>({
    queryKey: ["aggregate-expenses-all", year, month],
    queryFn: async () => {
      const res =
        await api.aggregateExpenses.aggregateAllByMonthAggregateExpensesAllGet({
          year,
          month,
        });
      return res.data as MonthlyAggregate[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <ProgressSpinner style={{ width: "1rem", height: "1rem" }} />
      </div>
    );
  }
  if (!data || data.length === 0) {
    return null;
  }

  const labels = data.map((item) =>
    typeof item.month === "number" ? monthNames[item.month - 1] : item.month
  );
  const expensesByMonth = data.map((item) => item.expenses_total);
  const incomesByMonth = data.map((item) => item.incomes_total);
  const budgetsByMonth = data.map((item) => item.budgets_total);
  const maxIncomes = Math.max(...incomesByMonth);

  const chartData = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Expenses",
        backgroundColor: "#FF6384",
        data: expensesByMonth,
        barThickness: 16,
        barPercentage: 0.5,
        categoryPercentage: 0.6,
      },
      {
        type: "bar" as const,
        label: "Income",
        backgroundColor: "#36A2EB",
        data: incomesByMonth,
        barThickness: 16,
        barPercentage: 0.5,
        categoryPercentage: 0.6,
      },
      {
        type: "line" as const,
        order: 2,
        label: "Budget",
        borderColor: "#FFCE56",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: budgetsByMonth,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.ceil((maxIncomes * 1.1) / 100) * 100,
        ticks: { callback: (v: number) => `${v}` },
      },
    },
    plugins: {
      legend: { position: "top" as const },
      tooltip: { mode: "index" as const, intersect: false },
    },
  };

  if (data.length === 1 && month) {
    const {
      expenses_total,
      incomes_total,
      budgets_total,
      savings_total,
      remaining_budget,
    } = data[0];
    const utilization =
      budgets_total > 0 ? (expenses_total / budgets_total) * 100 : 0;
    const stats = [
      {
        label: "Expenses",
        value: expenses_total,
        onAdd: () => openForm("expense"),
      },
      {
        label: "Income",
        value: incomes_total,
        onAdd: () => openForm("income"),
      },
      {
        label: "Budget",
        value: budgets_total,
        onAdd: () => openForm("budget"),
      },
      {
        label: "Savings",
        value: savings_total,
      },
    ];

    return (
      <>
        <div className="grid grid-cols-1 gap-2">
          <ProgressBarCard
            label="Budget Utilization"
            utilization={utilization}
            remaining={remaining_budget}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
            {stats.map((s, i) => (
              <Tile key={i} label={s.label} value={s.value} onAdd={s.onAdd} />
            ))}
          </div>
        </div>

        {activeForm === "income" && (
          <IncomeForm visible={showModal} onHide={closeForm} />
        )}
        {activeForm === "expense" && (
          <ExpenseForm visible={showModal} onHide={closeForm} />
        )}
        {activeForm === "budget" && (
          <BudgetForm visible={showModal} onHide={closeForm} />
        )}
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="w-full bg-white p-4 rounded-lg shadow">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
      <DataTable
        value={data}
        header={`Summary for ${year}`}
        responsiveLayout="scroll"
        className="mb-4"
      >
        <Column
          header="Year"
          body={year}
          sortable
          style={{ minWidth: "2rem" }}
        />
        <Column
          field="month"
          header="Month"
          sortable
          style={{ minWidth: "2rem" }}
        />
        <Column
          field="expenses_total"
          header="Expenses"
          sortable
          style={{ minWidth: "2rem" }}
          body={(rowData) => <Money amount={rowData.expenses_total} />}
        />
        <Column
          field="incomes_total"
          header="Income"
          sortable
          style={{ minWidth: "2rem" }}
          body={(rowData) => <Money amount={rowData.incomes_total} />}
        />
        <Column
          field="budgets_total"
          header="Budget"
          sortable
          style={{ minWidth: "2rem" }}
          body={(rowData) => <Money amount={rowData.budgets_total} />}
        />
      </DataTable>
    </div>
  );
};

export default AggregateExpensesByYear;
