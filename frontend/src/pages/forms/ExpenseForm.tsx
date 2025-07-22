import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../configApi";
import type {
  ExpenseCreate,
  ExpenseSchema,
  ExpenseCategorySchema,
} from "../../api";
import {
  FormTextField,
  FormNumberField,
  FormSelectField,
  FormDateField,
} from "../../components";
import { ModalForm } from "../../components/ModalForm";
import { toApiDate } from "../../utils/date";
import { showSuccess, showError } from "../../utils/toast";
type ExpenseFormProps = {
  initialData?: ExpenseSchema;
  visible: boolean;
  onHide: () => void;
};

const normalizeValues = (data?: ExpenseSchema): ExpenseCreate => ({
  description: data?.description ?? "",
  amount: data?.amount ?? 0,
  category_id: data?.category_id ?? 0,
  date: data ? toApiDate(data.date) : toApiDate(new Date()),
});

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  visible,
  onHide,
}) => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: catLoading } = useQuery<
    ExpenseCategorySchema[]
  >({
    queryKey: ["expenseCategories"],
    queryFn: async () => {
      const response =
        await api.expenseCategories.readItemsExpenseCategoriesGet();
      return response.data;
    },
  });

  const { reset, setFocus } = useForm<ExpenseCreate>({
    defaultValues: normalizeValues(initialData),
  });

  useEffect(() => {
    reset(normalizeValues(initialData));
    if (visible) {
      setFocus("description");
    }
  }, [initialData, reset, visible, setFocus]);

  const mutation = useMutation({
    mutationFn: async (data: ExpenseCreate) => {
      const payload = {
        ...data,
        date: toApiDate(data.date),
      };
      if (initialData) {
        const response = await api.expenses.updateItemExpensesItemIdPut(
          initialData.id,
          payload
        );
        return response.data;
      } else {
        const response = await api.expenses.createItemExpensesPost(payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["aggregate-expenses-all"] });
      queryClient.invalidateQueries({ queryKey: ["aggregate-expenses"] });
      showSuccess(
        "Success",
        initialData
          ? "Expense updated successfully."
          : "Expense created successfully."
      );
      handleClose();
    },
    onError: () => {
      showError("Error", "Failed to save expense.");
    },
  });

  const handleSubmit = async (data: ExpenseCreate) => {
    await mutation.mutateAsync(data);
  };

  const handleClose = () => {
    reset(normalizeValues(initialData));
    onHide();
  };

  return (
    <ModalForm<ExpenseCreate>
      visible={visible}
      header={initialData ? "Edit expense" : "Add expense"}
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
      <FormSelectField
        name="category_id"
        label="Category"
        options={categories.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }))}
        rules={{
          required: "Category is required",
          min: { value: 1, message: "Select a category" },
        }}
        placeholder="Select a category"
      />
      {catLoading && <p>Loading categories...</p>}
      <FormDateField
        name="date"
        label="Date"
        rules={{ required: "Date is required" }}
      />

      {mutation.isError && (
        <div className="p-error">
          Error{" "}
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Unknown error"}
        </div>
      )}
    </ModalForm>
  );
};

export default ExpenseForm;
