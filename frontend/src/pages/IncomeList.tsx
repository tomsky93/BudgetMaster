import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../configApi";
import type { IncomeSchema } from "../api/api";
import TransactionTable from "../components/TransactionTable";
import { Column } from "primereact/column";
import ActionButtons from "../components/ActionButtons";
import { useConfirm } from "../hooks/useConfirm";
import IncomeForm from "./forms/IncomeForm";
import { Money } from "../components/Money";
import { showSuccess, showError } from "../utils/toast";
import type { DataTableExpandedRows } from "primereact/datatable";
import { Card } from "primereact/card";

interface IncomeListProps {
  month: number;
  year: number;
}

const IncomeList: React.FC<IncomeListProps> = ({ month, year }) => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeSchema | null>(null);
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>({});
  const confirm = useConfirm();

  const handleClose = () => {
    setEditingIncome(null);
    setShowModal(false);
  };

  const {
    data: incomes,
    isLoading,
    error,
  } = useQuery<IncomeSchema[]>({
    queryKey: ["incomes", month, year],
    queryFn: async () => {
      const { data } = await api.income.readItemsIncomeGet({ month, year });
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.income.deleteItemIncomeItemIdDelete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes", month, year] });
      queryClient.invalidateQueries({ queryKey: ["aggregate-expenses-all"] });
      showSuccess("Success", "Income deleted successfully.");
    },
    onError: () => {
      showError("Error", "Failed to delete income.");
    },
  });

  if (isLoading) return null;
  if (error) return <div>Error while loading</div>;

  const handleDelete = (id: number) => {
    confirm({
      message: "Are you sure you want to delete this income?",
      accept: () => deleteMutation.mutate(id),
    });
  };

  const rowExpansionTemplate = (data: IncomeSchema) => (
    <div className="p-4 text-sm text-gray-700 flex items-start">
      <div className="flex-shrink-0 mr-4">
        <ActionButtons
          onEdit={() => {
            setEditingIncome(data);
            setShowModal(true);
          }}
          onDelete={() => handleDelete(data.id)}
          record={data}
        />
      </div>
      <div>
        <p>
          <span className="font-semibold">Description: </span>
          {data.description}
        </p>
        <p className="mt-1">
          <span className="font-semibold">Date: </span>
          {new Date(data.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  return (
    <Card className="pt-0 pb-1 px-1">
      <h6 className="text-2xl text-center pb-2">Incomes</h6>
      <TransactionTable<IncomeSchema>
        data={incomes ?? []}
        dataKey="id"
        expandedRows={expandedRows}
        onToggleRows={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
        rowExpansionTemplate={rowExpansionTemplate}
      >
        <Column expander headerStyle={{ display: "none" }} className="w-1rem" />
        <Column
          field="category"
          headerStyle={{ display: "none" }}
          body={(rowData) => <span>{rowData.category}</span>}
        />
        <Column
          field="amount"
          headerStyle={{ display: "none" }}
          body={(rowData) => <Money amount={rowData.amount} />}
        />
      </TransactionTable>
      <IncomeForm
        visible={showModal}
        onHide={handleClose}
        initialData={editingIncome ?? undefined}
      />
    </Card>
  );
};

export default IncomeList;
