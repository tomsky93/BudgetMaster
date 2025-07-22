import { confirmDialog } from 'primereact/confirmdialog';

export type ConfirmOptions = {
  message: string;
  header?: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  accept: () => void;
  reject?: () => void;
};

export const useConfirm = () => {
  const showConfirm = (options: ConfirmOptions) => {
    confirmDialog({
      header: options.header || 'Delete Confirmation',
      icon: options.icon || 'pi pi-exclamation-triangle',
      message: options.message,
      acceptLabel: options.acceptLabel || 'Yes',
      rejectLabel: options.rejectLabel || 'No',
      accept: options.accept,
      reject: options.reject || (() => {}),
    });
  };

  return showConfirm;
};
