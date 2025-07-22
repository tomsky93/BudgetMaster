import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../configApi";
import type { BudgetCreate, BudgetSchema } from "../../api";
import { showSuccess, showError } from "../../utils/toast";
import { format, setDate, parseISO } from "date-fns";
import { FormNumberField, FormDateField } from "../../components";
import { ModalForm } from "../../components/ModalForm";

type BudgetFormProps = {
  initialData?: BudgetSchema;
  visible: boolean;
  onHide: () => void;
};

const getDefaultDate = (dateStr?: string): string => {
  const baseDate = dateStr ? parseISO(dateStr) : new Date();
  const fifteenth = setDate(baseDate, 15);
  return format(fifteenth, "yyyy-MM-dd");
};

const normalizeValues = (data?: BudgetSchema): BudgetCreate => ({
  amount: data?.amount ?? 0,
  date: data?.date ?? getDefaultDate(data?.date),
});

const BudgetForm: React.FC<BudgetFormProps> = ({
  initialData,
  visible,
  onHide,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: BudgetCreate) => {
      const dateISO = format(setDate(parseISO(data.date), 15), "yyyy-MM-dd");
      const payload = { ...data, date: dateISO };

      if (initialData) {
        const response = await api.budget.updateItemBudgetItemIdPut(
          initialData.id,
          payload
        );
        return response.data;
      } else {
        const response = await api.budget.createItemBudgetPost(payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      showSuccess(
        "Success",
        initialData
          ? "Budget updated successfully."
          : "Budget created successfully."
      );
      onHide();
    },
    onError: () => {
      showError("Error", "Failed to save budget. Please check date.");
    },
  });

  const handleSubmit = async (data: BudgetCreate) => {
    await mutation.mutateAsync(data);
  };

  return (
    <>
      <ModalForm<BudgetCreate>
        visible={visible}
        header={initialData ? "Update budget" : "Create budget"}
        defaultValues={normalizeValues(initialData)}
        onSubmit={handleSubmit}
        onHide={onHide}
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
          view="month"
          dateFormat="yy-mm"
          rules={{ required: "Date is required" }}
        />
      </ModalForm>
    </>
  );
};

export default BudgetForm;
