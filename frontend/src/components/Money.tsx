import React from 'react';
import useAuth from "../hooks/useAuth";

interface MoneyProps {
  amount: number;
  currency?: string;
  locale?: string;
  options?: Intl.NumberFormatOptions;
  hideDecimals?: boolean;
}

export const Money: React.FC<MoneyProps> = ({
  amount,
  currency,
  locale,
  options,
  hideDecimals = false,
}) => {
  const { user } = useAuth();

  const curr = currency ?? user?.currency ?? 'USD';
  const loc  = locale  ?? user?.locale ?? 'en-US';

  let formatterOptions: Intl.NumberFormatOptions;
  if (hideDecimals) {
    formatterOptions = {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    };
  } else {
    formatterOptions = {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    };
  }

  const formatted = new Intl.NumberFormat(loc, formatterOptions).format(amount);

  return <span>{formatted}</span>;
};
