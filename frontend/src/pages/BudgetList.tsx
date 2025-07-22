import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import api from "../configApi";
import type { BudgetSchema } from "../api";
import { ConfirmDialog } from "primereact/confirmdialog";
import BudgetForm from "./forms/BudgetForm";
import ActionButtons from "../components/ActionButtons";
import { useConfirm } from "../hooks/useConfirm";
import { Money } from "../components/Money";
import { showSuccess, showError } from "../utils/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const BudgetList: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState<BudgetSchema | null>(
    null
  );
  const confirm = useConfirm();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.budget.deleteItemBudgetItemIdDelete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      showSuccess("Success", "Budget deleted successfully.");
    },
    onError: () => {
      showError("Error", "Failed to delete budget.");
    },
  });

  const handleDelete = (id: number) => {
    confirm({
      message: "Are you sure you want to delete this budget?",
      accept: () => deleteMutation.mutate(id),
    });
  };

  const { data: budgets, isLoading } = useQuery<BudgetSchema[]>({
    queryKey: ["budgets"],
    queryFn: async () => {
      const response = await api.budget.readItemsBudgetGet();
      return response.data;
    },
  });

  return (
    <div className="mx-auto w-full sm:w-4/5 md:w-3/5 lg:w-2/5 mt-16">
      <div className="flex items-center gap-2  mb-4">
        <h1 className="text-3xl">Budgets</h1>
        <Button
          className="p-button p-component p-button-text"
          icon="pi pi-plus"
          onClick={() => {
            setEditingBudget(null);
            setShowModal(true);
          }}
        />
      </div>
      <ConfirmDialog />
      <Card>
        <BudgetForm
          visible={showModal}
          onHide={() => setShowModal(false)}
          initialData={editingBudget || undefined}
        />
        {budgets && budgets.length > 0 ? (
          <DataTable
            value={budgets}
            dataKey="id"
            sortField="date"
            loading={isLoading}
            sortOrder={-1}
          >
            <Column
              field="amount"
              header="Amount"
              body={(rowData) => <Money amount={rowData.amount} />}
            ></Column>
            <Column
              field="date"
              sortable
              header="Month"
              body={(rowData) =>
                new Date(rowData.date).toLocaleDateString("pl-PL", {
                  month: "2-digit",
                  year: "numeric",
                })
              }
            ></Column>
            <Column
              header="Actions"
              body={(rowData) => (
                <ActionButtons
                  record={rowData}
                  onEdit={(b: BudgetSchema) => {
                    setEditingBudget(b);
                    setShowModal(true);
                  }}
                  onDelete={handleDelete}
                />
              )}
            ></Column>
          </DataTable>
        ) : (
          <div className="text-center">No budgets to display. Click + icon to create one.</div>
        )}
      </Card>
    </div>
  );
};
export default BudgetList;
