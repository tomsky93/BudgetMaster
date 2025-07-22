import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../configApi";
import type {
  RecurringExpenseCreate,
  RecurringExpenseResponse,
} from "../../api";
import { ModalForm } from "../../components/ModalForm";
import {
  FormTextField,
  FormNumberField,
  FormSelectField,
  FormDateField,
} from "../../components";

import { showSuccess, showError } from "../../utils/toast";
import { toApiDate } from "../../utils/date";

type RecurringExpenseFormProps = {
  initialData?: RecurringExpenseResponse;
  visible: boolean;
  onHide: () => void;
};

const normalizeValues = (
  data?: RecurringExpenseCreate
): RecurringExpenseCreate => ({
  description: data?.description ?? "",
  amount: data?.amount ?? 0,
  category_id: data?.category_id ?? 0,
  frequency: data?.frequency ?? "monthly",
  next_due_date: data ? data.next_due_date : toApiDate(new Date()),
});

const RecurringExpenseForm: React.FC<RecurringExpenseFormProps> = ({
  initialData,
  visible,
  onHide,
}) => {
  const queryClient = useQueryClient();

  const { reset } = useForm<RecurringExpenseResponse>({
    defaultValues: normalizeValues(initialData),
  });
  useEffect(() => {
    if (visible) {
      reset(normalizeValues(initialData));
    }
  }, [reset, initialData, visible]);

  const mutation = useMutation({
    mutationFn: async (data: RecurringExpenseResponse) => {
      const payload = {
        ...data,
        next_due_date: toApiDate(data.next_due_date),
      };
      if (initialData?.id) {
        return api.recurringExpenses.updateItemRecurringExpensesItemIdPut(
          initialData.id,
          payload
        );
      } else {
        return api.recurringExpenses.createItemRecurringExpensesPost(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-expenses"] });
      showSuccess("Success", "Expense saved successfully!");
      onHide();
    },
    onError: () => {
      showError("Error", "An error occurred while saving the expense.");
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["expenseCategories"],
    queryFn: () =>
      api.expenseCategories
        .readItemsExpenseCategoriesGet()
        .then((res) => res.data),
  });

  const categoryOptions =
    categories?.map((c) => ({ label: c.name, value: c.id })) || [];

  const frequencyOptions = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];

  const handleSubmit = async (data: RecurringExpenseResponse) => {
    await mutation.mutateAsync(data);
  };

  return (
    <ModalForm<RecurringExpenseResponse>
      visible={visible}
      header={
        initialData ? "Update Recurring Expense" : "Create Recurring Expense"
      }
      defaultValues={normalizeValues(initialData)}
      onSubmit={handleSubmit}
      onHide={onHide}
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
          min: { value: 0.01, message: "Amount must be positive" },
        }}
      />

      <FormSelectField
        name="category_id"
        label="Category"
        options={categoryOptions}
        rules={{ required: "Category is required" }}
      />

      <FormSelectField
        name="frequency"
        label="Frequency"
        options={frequencyOptions}
        rules={{ required: "Frequency is required" }}
      />

      <FormDateField
        name="next_due_date"
        label="Next Due Date"
        rules={{ required: "Next due date is required" }}
      />
    </ModalForm>
  );
};

export default RecurringExpenseForm;
