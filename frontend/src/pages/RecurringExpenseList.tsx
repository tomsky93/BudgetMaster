import React, { useState } from "react";
import api from "../configApi";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../components/ActionButtons";
import { useConfirm } from "../hooks/useConfirm";
import RecurringExpenseForm from "./forms/RecurringExpenseForm";
import type { RecurringExpenseResponse } from "../api";
import { Money } from "../components/Money";
import { showSuccess, showError } from "../utils/toast";

type ExpenseRow = Omit<RecurringExpenseResponse, "next_due_date"> & {
  next_due_date: Date;
};

const RecurringExpenseList: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<ExpenseRow | null>(null);
  const confirm = useConfirm();

  const { data: rows = [] } = useQuery<
    RecurringExpenseResponse[],
    Error,
    ExpenseRow[]
  >({
    queryKey: ["recurring-expenses"],
    queryFn: async () => {
      const { data } =
        await api.recurringExpenses.readItemsRecurringExpensesGet();
      return data;
    },
    select: (data) =>
      data.map((item) => ({
        ...item,
        next_due_date: new Date(item.next_due_date),
      })),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data } =
        await api.recurringExpenses.deleteItemRecurringExpensesItemIdDelete(id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      showSuccess("Success", "Recurring expense deleted successfully.");
    },
    onError: () => {
      showError("Error", "Failed to delete recurring expense.");
    },
  });

  const handleDelete = (id: number) => {
    confirm({
      message: "Are you sure you want to delete this recurring expense?",
      accept: () => deleteMutation.mutate(id),
    });
  };

  return (
    <div className="mx-auto w-full sm:w-4/5 md:w-3/5 lg:w-3/5 mt-16">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-3xl">Recurring Expenses</h1>
        <Button
          icon="pi pi-plus"
          className="p-button-text"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
        />
      </div>

      <ConfirmDialog />

      <DataTable
        value={rows}
        dataKey="id"
        sortField="next_due_date"
        sortOrder={1}
      >
        <Column field="description" header="Description" />
        <Column
          field="amount"
          header="Amount"
          sortable
          body={(row: ExpenseRow) => <Money amount={row.amount} />}
        />
        <Column field="category_name" header="Category" />
        <Column field="frequency" header="Frequency" />
        <Column
          field="next_due_date"
          header="Next Due Date"
          sortable
          body={(row: ExpenseRow) => row.next_due_date.toLocaleDateString()}
        />
        <Column
          header="Actions"
          body={(row) => (
            <ActionButtons
              record={row}
              onEdit={() => {
                setEditData(row);
                setShowModal(true);
              }}
              onDelete={() => handleDelete(row.id)}
            />
          )}
        />
      </DataTable>

      <RecurringExpenseForm
        visible={showModal}
        onHide={() => setShowModal(false)}
        initialData={
          editData
            ? {
                ...editData,
                next_due_date: editData.next_due_date.toISOString(),
              }
            : undefined
        }
      />
    </div>
  );
};

export default RecurringExpenseList;
