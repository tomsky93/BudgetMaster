import React, { useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../configApi";
import type { SavingGoalSchema, SavingGoalCreate } from "../../api/api";
import { showSuccess, showError } from "../../utils/toast";
import {
  FormTextField,
  FormNumberField,
  FormDateField,
  IconPicker,
} from "../../components";
import { ModalForm } from "../../components/ModalForm";
import { toApiDate } from "../../utils/date";
import { CATEGORY_ICONS } from "../../utils/iconConfig";

type SavingGoalFormProps = {
  initialData?: SavingGoalSchema;
  visible: boolean;
  onHide: () => void;
};

const normalizeValues = (data?: SavingGoalSchema): SavingGoalCreate => ({
  title: data?.title ?? "",
  target_amount: data?.target_amount ?? 0,
  deadline: data ? toApiDate(data.deadline) : toApiDate(new Date()),
  owner_id: data?.owner_id ?? 0,
  icon: data?.icon ?? "",
});

export const SavingGoalForm: React.FC<SavingGoalFormProps> = ({
  initialData,
  visible,
  onHide,
}) => {
  const queryClient = useQueryClient();

  const methods = useForm<SavingGoalCreate>({
    defaultValues: normalizeValues(initialData),
  });
  const { reset } = methods;

  useEffect(() => {
    reset(normalizeValues(initialData));
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: (data: SavingGoalCreate) =>
      initialData
        ? api.savings
            .updateItemSavingsItemIdPut(initialData.id, data)
            .then((res) => res.data)
        : api.savings.createItemSavingsPost(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
      showSuccess("success", "Saving Goal saved successfully");
      onHide();
    },
    onError: (error: Error) => {
      showError("Error", error.message || "Failed to save saving goal");
    },
  });

  const handleSubmit: SubmitHandler<SavingGoalCreate> = async (data) => {
    await mutation.mutateAsync(data);
  };

  return (
    <FormProvider {...methods}>
      <ModalForm
        header={initialData ? "Edit Saving Goal" : "Create Saving Goal"}
        defaultValues={normalizeValues(initialData)}
        visible={visible}
        onHide={onHide}
        onSubmit={handleSubmit}
        loading={mutation.isPending}
      >
        <FormTextField
          name="title"
          label="Title"
          rules={{ required: "Title is required" }}
        />
        <FormNumberField
          name="target_amount"
          label="Target Amount"
          rules={{ required: "Target amount is required", min: 0.01 }}
          classNames={{
            wrapper: "mb-4",
            label: "block text-md font-medium text-gray-500",
            error: "mt-1 text-red-500 text-sm",
          }}
        />
        <FormDateField
          name="deadline"
          label="Deadline"
          rules={{ required: "Deadline is required" }}
        />
        <IconPicker
          name="icon"
          label="Icon"
          rules={{ required: "Icon is required" }}
          options={CATEGORY_ICONS}
        />
      </ModalForm>
    </FormProvider>
  );
};

export default SavingGoalForm;
