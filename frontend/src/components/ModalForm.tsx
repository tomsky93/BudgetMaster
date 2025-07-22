import React, { useEffect } from 'react';
import { useForm, FormProvider, FieldValues, DefaultValues } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

type ModalFormProps<T extends FieldValues> = {
  visible: boolean;
  header: string;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => void;
  onHide: () => void;
  children: React.ReactNode;
  loading?: boolean; 
};

export function ModalForm<T extends FieldValues>({
  visible,
  header,
  defaultValues,
  onSubmit,
  onHide,
  children,
  loading = false, 
}: ModalFormProps<T>) {
  const methods = useForm<T>({ defaultValues });
  const { handleSubmit, reset } = methods;

  useEffect(() => {
   if (visible) {
     reset(defaultValues);
   }
 }, [defaultValues, visible, reset]);

  return (
    <Dialog header={header} visible={visible} onHide={onHide} style={{ width: 400 }}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          {children}
          <div className="flex justify-content-end gap-2 mt-4">
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              onClick={onHide}
              className="p-button-text"
            />
            <Button
              type="submit"
              label="Save"
              icon="pi pi-check"
              loading={loading} 
            />
          </div>
        </form>
      </FormProvider>
    </Dialog>
  );
}