import React, { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import api from "../configApi";
import type { AggregatedExpensesResponse } from "../api/models/AggregatedExpensesResponse";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Chart } from "primereact/chart";

interface Props {
  year: number;
}

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

const ExpensesByCategoryChart: React.FC<Props> = ({ year }) => {
  const monthQueries = useQueries({
    queries: monthNames.map((_, idx) => ({
      queryKey: ["aggregate-expenses", year, idx + 1],
      queryFn: async () => {
        const response =
          await api.aggregateExpenses.aggregateExpensesAggregateExpensesGet({
            year,
            month: idx + 1,
          });
        return response.data as AggregatedExpensesResponse[];
      },
      refetchOnWindowFocus: false,
    })),
  });

  const isLoading = monthQueries.some((q) => q.isLoading);
  const allData = monthQueries.map((q) => q.data || []);

  const { labels, datasets, maxSum } = useMemo(() => {
    const categoryMap: Record<string, string> = {};
    allData.forEach((monthArr) => {
      monthArr.forEach((item) => {
        const color = item.color.startsWith("#")
          ? item.color
          : `#${item.color}`;
        categoryMap[item.category] = color;
      });
    });

    const categories = Object.keys(categoryMap);
    const validIndices = allData.map(
      (mArr) => mArr.reduce((sum, item) => sum + item.total, 0) > 0
    );
    const filteredLabels = monthNames.filter((_, idx) => validIndices[idx]);
    const filteredData = allData.filter((_, idx) => validIndices[idx]);
    const monthlyTotals = filteredData.map((mArr) =>
      mArr.reduce((sum, item) => sum + item.total, 0)
    );
    const maxSum = monthlyTotals.length > 0 ? Math.max(...monthlyTotals) : 0;

    const datasets = categories.map((cat) => ({
      label: cat,
      data: filteredData.map((mArr) => {
        const found = mArr.find((it) => it.category === cat);
        return found ? found.total : 0;
      }),
      backgroundColor: categoryMap[cat],
      stack: "expenseStack",
    }));

    return { labels: filteredLabels, datasets, maxSum };
  }, [allData]);

  const chartOptions = useMemo(
    () => ({
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      datasets: {
        bar: {
          maxBarThickness: 30,
        },
      },
      scales: {
        x: { stacked: true, title: { display: true, text: "Month" } },
        y: {
          stacked: true,
          title: { display: true, text: "Amount" },
          ticks: {
            beginAtZero: true,
            suggestedMax: Math.ceil(maxSum * 1.1),
          },
        },
      },
    }),
    [maxSum]
  );
  return (
    <Card className="p-4">
      <h6 className="text-xl font-semibold text-gray-800 text-center mb-4">
        Expenses by category
      </h6>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <ProgressSpinner style={{ width: "2rem", height: "2rem" }} />
        </div>
      ) : (
        <div
          style={{ position: "relative", height: "300px", minHeight: "300px" }}
        >
          <Chart
            type="bar"
            data={{ labels, datasets }}
            options={chartOptions}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </Card>
  );
};

export default ExpensesByCategoryChart;
