import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../configApi";
import type { IncomeSchema, IncomeCreate } from "../../api/api";
import { IncomeCategoryEnum } from "../../api/api";
import { showSuccess, showError } from "../../utils/toast";
import {
  FormTextField,
  FormNumberField,
  FormSelectField,
  FormDateField,
} from "../../components";
import { ModalForm } from "../../components/ModalForm";
import { toApiDate } from "../../utils/date";

type IncomeFormProps = {
  initialData?: IncomeSchema;
  visible: boolean;
  onHide: () => void;
};

const normalizeValues = (data?: IncomeSchema): IncomeCreate => ({
  description: data?.description ?? "",
  amount: data?.amount ?? 0,
  date: data ? toApiDate(data.date) : toApiDate(new Date()),
  category: data?.category ?? Object.values(IncomeCategoryEnum)[0],
});

const IncomeForm: React.FC<IncomeFormProps> = ({
  initialData,
  visible,
  onHide,
}) => {
  const queryClient = useQueryClient();

  const { reset } = useForm<IncomeCreate>({
    defaultValues: normalizeValues(initialData),
  });

  useEffect(() => {
    reset(normalizeValues(initialData));
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: async (data: IncomeCreate) => {
      const payload: IncomeCreate = {
        ...data,
      };
      if (initialData) {
        const response = await api.income.updateItemIncomeItemIdPut(
          initialData.id,
          payload
        );
        return response.data;
      } else {
        const response = await api.income.createItemIncomePost(payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
      queryClient.invalidateQueries({ queryKey: ["aggregate-expenses-all"] });

      showSuccess(
        "Success",
        initialData
          ? "Income updated successfully."
          : "Income created successfully."
      );
      handleClose();
    },
    onError: () => {
      showError("Error", "Failed to save income.");
    },
  });

  const handleSubmit: SubmitHandler<IncomeCreate> = async (data) => {
    await mutation.mutateAsync(data);
  };

  const handleClose = () => {
    reset(normalizeValues(initialData));
    onHide();
  };

  return (
    <ModalForm
      visible={visible}
      header={initialData ? "Edit Income" : "Add Income"}
      defaultValues={normalizeValues(initialData)}
      onSubmit={handleSubmit}
      onHide={handleClose}
      loading={mutation.isPending}
    >
      <FormTextField
        name="description"
        label="Description"
        rules={{ required: "Description is required" }}
      />
      <FormNumberField
        name="amount"
        label="Amount"
        rules={{
          required: "Amount is required",
          min: { value: 0.01, message: "Amount must be greater than 0" },
        }}
      />
      <FormDateField
        name="date"
        label="Date"
        rules={{ required: "Date is required" }}
      />
      <FormSelectField
        name="category"
        label="Category"
        options={Object.values(IncomeCategoryEnum).map((category) => ({
          label: category,
          value: category,
        }))}
        rules={{ required: "Category is required" }}
      />
    </ModalForm>
  );
};

export default IncomeForm;
