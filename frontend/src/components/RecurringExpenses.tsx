import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../configApi";
import type {
  RecurringExpenseInstance,
  RecurringExpenseMonthResponse,
} from "../api";
import TransactionTable from "../components/TransactionTable";
import type { DataTableExpandedRows } from "primereact/datatable";
import { Column } from "primereact/column";
import { Money } from "../components/Money";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";

interface RecurringExpensesProps {
  month: number;
  year: number;
}

const RecurringExpenses: React.FC<RecurringExpensesProps> = ({
  month,
  year,
}) => {
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>({});
  const { data, isLoading, error } = useQuery<
    RecurringExpenseMonthResponse,
    Error
  >({
    queryKey: ["recurring-expenses-month", month, year],
    queryFn: async () => {
      const response =
        await api.recurringExpenses.getMonthlyInstancesRecurringExpensesInstancesGet(
          { month, year }
        );
      return response.data;
    },
  });

  if (isLoading) return <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)"/> ;
  if (error) return <div>Error while loading</div>;

  const instances = data?.instances ?? [];
  if (!isLoading && !error && instances.length === 0) {
    return null;
  }

  const rowExpansionTemplate = (rowData: RecurringExpenseInstance) => {
    return (
      <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-600">{rowData.description}</p>
        <p className="text-sm text-gray-600">
          Category: {rowData.category_name}
        </p>
        <p className="text-sm text-gray-600">
          Amount: <Money amount={rowData.amount} />
        </p>
        <p className="text-sm text-gray-600">
          Date: {new Date(rowData.date).toLocaleDateString()}
        </p>
      </div>
    );
  };

  return (
    <div>
      <Card>
        <h2 className="text-xl text-center">
          Recurring Expenses
          <span></span> <Money amount={data?.total_amount ?? 0} />
        </h2>
        <TransactionTable<RecurringExpenseInstance>
          data={instances}
          dataKey="id"
          scrollable
          scrollHeight="450px"
          expandedRows={expandedRows}
          rowExpansionTemplate={rowExpansionTemplate}
          onToggleRows={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
        >
          <Column
            expander
            className="w-1rem"
            headerStyle={{ display: "none" }}
          />
          <Column field="description" headerStyle={{ display: "none" }} />
          <Column
            field="amount"
            headerStyle={{ display: "none" }}
            body={(rowData) => <Money amount={rowData.amount} />}
          />
          <Column
            field="date"
            className="w-2rem"
            headerStyle={{ display: "none" }}
          />
        </TransactionTable>
      </Card>
    </div>
  );
};

export default RecurringExpenses;
