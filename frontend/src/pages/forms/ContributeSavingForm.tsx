import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../configApi";
import type { SavingContributionCreate } from "../../api";
import { showSuccess, showError } from "../../utils/toast";
import { FormNumberField, FormDateField } from "../../components";
import { ModalForm } from "../../components/ModalForm";

type ContributeSavingFormProps = {
  goalId: number;    
  initialData?: SavingContributionCreate;
  visible: boolean;
  onHide: () => void;
};

const normalizeValues = (data?: SavingContributionCreate): SavingContributionCreate => ({
  saving_goal_id: data?.saving_goal_id ?? 0,
  amount: data?.amount ?? 0,
  date: data?.date ?? new Date().toISOString().split("T")[0],
  description: data?.description ?? "",
});

const ContributeSavingForm: React.FC<ContributeSavingFormProps> = ({
  goalId,
  initialData,
  visible,
  onHide,
}) => {
  const queryClient = useQueryClient();


  const mutation = useMutation({
    mutationFn: (data: SavingContributionCreate) =>
      api.deposit.depositToGoalDepositGoalIdPost(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savingContributions"] });
      queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
      showSuccess("Success", "Contribution created successfully.");
      onHide();
    },
    onError: () => {
      showError("Error", "Failed to save contribution.");
    },
  });

  const handleSubmit = async (data: SavingContributionCreate) => {
    await mutation.mutateAsync(data);
  
  };

  return (
    <ModalForm<SavingContributionCreate>
      visible={visible}
      onHide={onHide}
      defaultValues={normalizeValues(initialData)}
      header="Contribute to Saving Goal"
      onSubmit={handleSubmit}
      loading={mutation.isPending}
    >
      <FormNumberField
        name="amount"
        label="Amount"
        rules={{ required: "Amount is required" }}
      />
      <FormDateField
        name="date"
        label="Date"
        rules={{ required: "Date is required" }}
      />
    </ModalForm>
  );
};

export default ContributeSavingForm;
