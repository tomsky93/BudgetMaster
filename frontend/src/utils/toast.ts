import { createRef } from 'react';
import { Toast } from 'primereact/toast';

export const toastRef = createRef<Toast>();

export function showToast(options: {
  severity: 'success' | 'info' | 'warn' | 'error';
  summary: string;
  detail: string;
  life?: number;
}) {
  toastRef.current?.show(options);
}

export function showSuccess(
  summary: string,
  detail: string,
  life = 2000
) {
  showToast({ severity: 'success', summary, detail, life });
}

export function showError(
  summary: string,
  detail: string,
  life = 2000
) {
  showToast({ severity: 'error', summary, detail, life });
}