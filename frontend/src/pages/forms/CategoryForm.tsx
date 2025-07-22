import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../configApi";
import type { ExpenseCategoryCreate, ExpenseCategorySchema } from "../../api";
import { showSuccess, showError } from "../../utils/toast";
import { ModalForm } from "../../components/ModalForm";
import { CATEGORY_ICONS } from "../../utils/iconConfig";
import { FormTextField, IconPicker, ColorPickerField } from "../../components";

type CategoryFormProps = {
  initialData?: ExpenseCategorySchema;
  visible: boolean;
  onHide: () => void;
};

const normalizeValues = (
  data?: ExpenseCategorySchema
): ExpenseCategoryCreate => ({
  name: data?.name ?? "",
  color: data?.color ?? "#FFFFFF",
  icon: data?.icon ?? CATEGORY_ICONS[0].value,
});

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  visible,
  onHide,
}) => {
  const queryClient = useQueryClient();

  const { reset } = useForm<ExpenseCategoryCreate>({
    defaultValues: normalizeValues(initialData),
  });

  useEffect(() => {
    reset(normalizeValues(initialData));
  }, [initialData, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ExpenseCategoryCreate) => {
      const payload = {
        ...data,
      };

      if (initialData) {
        const response =
          await api.expenseCategories.updateItemExpenseCategoriesItemIdPut(
            initialData.id,
            payload
          );
        return response.data;
      } else {
        const response =
          await api.expenseCategories.createItemExpenseCategoriesPost(payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      showSuccess("Success", "Category saved successfully.");
      handleClose();
    },
    onError: () => {
      showError("Error", "Failed to save category.");
    },
  });

  const handleSubmit = async (data: ExpenseCategoryCreate) => {
    await mutation.mutateAsync(data);
  };

  const handleClose = () => {
    reset(normalizeValues(initialData));
    onHide();
  };

  return (
    <ModalForm
      header={initialData ? "Edit Category" : "Add Category"}
      visible={visible}
      defaultValues={normalizeValues(initialData)}
      onSubmit={handleSubmit}
      onHide={handleClose}
      loading={mutation.isPending}
    >
      <FormTextField
        name="name"
        label="Category Name"
        rules={{ required: "Category name is required" }}
      />
      <IconPicker
        name="icon"
        label="Icon"
        rules={{ required: "Icon is required" }}
        options={CATEGORY_ICONS}
      />
      <ColorPickerField
        name="color"
        label="Color"
        rules={{
          required: "Color is required",
          validate: {
            notWhite: (value = "") =>
              value.toLowerCase() !== "#ffffff" || "Color cannot be white",
          },
        }}
      />
    </ModalForm>
  );
};

export default CategoryForm;
