import { useRef, useCallback } from 'react';
import { Toast } from 'primereact/toast';

export interface ToastOptions {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
  life?: number;
}

export const useToast = () => {
  const toastRef = useRef<Toast>(null);

  const showToast = useCallback((options: ToastOptions) => {
    toastRef.current?.show(options);
  }, []);

  const showSuccess = useCallback(
    (summary: string, detail: string, life: number = 2000) => {
      showToast({ severity: 'success', summary, detail, life });
    },
    [showToast]
  );

  const showError = useCallback(
    (summary: string, detail: string, life: number = 2000) => {
      showToast({ severity: 'error', summary, detail, life });
    },
    [showToast]
  );

  return {
    toastRef,
    showToast,
    showSuccess,
    showError,
  };
};
