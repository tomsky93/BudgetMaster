import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../configApi";
import type { AggregatedExpensesResponse } from "../api/models/AggregatedExpensesResponse";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Money } from "../components/Money";

type Props = Parameters<
  typeof api.aggregateExpenses.aggregateExpensesAggregateExpensesGet
>[0];

const ExpensesByCategory: React.FC<Props> = ({ year, month }) => {
  const { data, isLoading } = useQuery<AggregatedExpensesResponse[]>({
    queryKey: ["aggregate-expenses", year, month],
    queryFn: async () => {
      const response =
        await api.aggregateExpenses.aggregateExpensesAggregateExpensesGet({
          year,
          month,
        });
      return response.data as AggregatedExpensesResponse[];
    },
  });
  

  const { sortedLabels, percentData, barColors, rawAmounts } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        sortedLabels: [] as string[],
        percentData: [] as number[],
        barColors: [] as string[],
        rawAmounts: [] as number[],
      };
    }

    const sorted = [...data].sort((a, b) => b.total - a.total);
    const totalSum = sorted.reduce((acc, cur) => acc + cur.total, 0);

    const labelsArr = sorted.map((d) => d.category);
    const amountsArr = sorted.map((d) => d.total);
    const colorsArr = sorted.map((d) =>
      d.color.startsWith("#") ? d.color : `#${d.color}`
    );

    const percArr = sorted.map((d) =>
      totalSum > 0 ? Math.round((d.total / totalSum) * 100) : 0
    );

    return {
      sortedLabels: labelsArr,
      rawAmounts: amountsArr,
      barColors: colorsArr,
      percentData: percArr,
    };
  }, [data]);

  return (
<Card className="pt-0 pb-1 px-1">
  <h6 className="text-2xl text-center pb-4">Monthly Spendings</h6>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <ProgressSpinner style={{ width: "2.5rem", height: "2.5rem" }} />
        </div>
      ) : !data || data.length === 0 ? (
        <p className="text-center text-gray-600 py-6">
          No expenses found for this month.
        </p>
      ) : (
        <div className="space-y-4">
          {sortedLabels.map((label, idx) => {
            const percent = percentData[idx];
            const color = barColors[idx];
            const amount = rawAmounts[idx] ?? 0;

            return (
              <div key={label} className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-lg h-4 overflow-hidden">
                  <div
                    className="h-4 rounded-lg"
                    style={{ width: `${percent}%`, backgroundColor: color }}
                  />
                </div>
                <div className="ml-4 w-45">
                  <div className="flex justify-between">
                    <span className="text-gray-700">{label}</span>
                    <span className="text-gray-700">
                      <Money amount={amount} hideDecimals={true} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default ExpensesByCategory;
