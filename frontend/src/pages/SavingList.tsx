import React, { useState } from "react";
import SavingGoalForm from "./forms/SavingGoalForm";
import ContributeSavingForm from "./forms/ContributeSavingForm";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import api from "../configApi";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import type { SavingGoalSchema } from "../api";
import ActionButtons from "../components/ActionButtons";
import { useConfirm } from "../hooks/useConfirm";
import { Money } from "../components/Money";
import { showSuccess, showError } from "../utils/toast";
import { Card } from "primereact/card";

const SavingList: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingSavingGoal, setEditingSavingGoal] =
    React.useState<SavingGoalSchema | null>(null);
  const [selectedGoalId, setSelectedGoalId] = React.useState<number | null>(
    null
  );
  const [isContributeModalVisible, setIsContributeModalVisible] =
    React.useState(false);
  const confirm = useConfirm();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.savings.deleteItemSavingsItemIdDelete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
      showSuccess("Success", "Saving goal deleted successfully.");
    },
    onError: () => {
      showError("Error", "Failed to delete saving goal.");
    },
  });

  const handleDelete = (id: number) => {
    confirm({
      message: "Are you sure you want to delete this saving goal?",
      accept: () => deleteMutation.mutate(id),
    });
  };

  const { data: savingGoals, isLoading } = useQuery({
    queryKey: ["saving-goals"],
    queryFn: async () => {
      const response = await api.savings.readItemsSavingsGet();
      return response.data;
    },
  });

  const handleClose = () => {
    setEditingSavingGoal(null);
    setShowModal(false);
  };

  return (
    <div className="mx-auto w-full sm:w-4/5 md:w-3/5 lg:w-3/5 mt-16">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-3xl">Savings</h1>
        <Button
          icon="pi pi-plus"
          className="p-button p-component p-button-text"
          onClick={() => setShowModal(true)}
        />
      </div>
      <SavingGoalForm
        visible={showModal}
        onHide={handleClose}
        initialData={editingSavingGoal ?? undefined}
      />
      <ContributeSavingForm
        visible={isContributeModalVisible}
        goalId={selectedGoalId!}
        onHide={() => {
          setIsContributeModalVisible(false);
          setSelectedGoalId(null);
        }}
      />
      {savingGoals && savingGoals.length > 0 ? (
        <DataTable
          value={savingGoals}
          dataKey="id"
          sortField="date"
          loading={isLoading}
          sortOrder={-1}
        >
          <Column
            field="title"
            header="Title"
            body={(rowData) => (
              <div className="flex items-center">
                <i className={`${rowData.icon} text-2xl mr-2`} />
                {rowData.title}
              </div>
            )}
          ></Column>
          <Column
            field="current_amount"
            header="Current Amount"
            body={(rowData) => <Money amount={rowData.current_amount} />}
          ></Column>
          <Column
            field="progress_percent"
            header="Progress"
            body={(rowData) => (
              <div className="flex items-center">
                <span className="mr-2">{rowData.progress_percent}%</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${rowData.progress_percent}%` }}
                  ></div>
                </div>
              </div>
            )}
          ></Column>
          <Column
            field="target_amount"
            header="Target Amount"
            body={(rowData) => <Money amount={rowData.target_amount} />}
          ></Column>
          <Column
            field="deadline"
            sortable
            header="Deadline"
            body={(rowData) => new Date(rowData.deadline).toLocaleDateString()}
          ></Column>
          <Column
            header="Actions"
            body={(rowData) => (
              <ActionButtons
                record={rowData}
                onEdit={(savingGoal: SavingGoalSchema) => {
                  setEditingSavingGoal(savingGoal);
                  setShowModal(true);
                }}
                onDelete={() => handleDelete(rowData.id)}
              />
            )}
          ></Column>
          <Column
            header="Contribute"
            body={(rowData) => (
              <Button
                icon="pi pi-plus"
                className="p-button p-component p-button-text"
                onClick={() => {
                  setSelectedGoalId(rowData.id);
                  setIsContributeModalVisible(true); 
                }}
              />
            )}
          />
        </DataTable>
      ) : null}
      {savingGoals && savingGoals.length === 0 && (
        <Card className="p-text-center">
          <p>No saving goals found. Click + icon to create one.</p>
        </Card>
      )}
      <ConfirmDialog />
    </div>
  );
};

export default SavingList;
