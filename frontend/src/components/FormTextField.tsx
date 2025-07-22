import React from "react";
import {
  Controller,
  RegisterOptions,
  Path,
  FieldValues,
} from "react-hook-form";
import { InputText } from "primereact/inputtext";

interface FormTextFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T, Path<T>>;
  type?: React.HTMLInputTypeAttribute;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
    error?: string;
  };
}

export function FormTextField<T extends FieldValues>({
  name,
  label,
  rules,
  type = "text",
  classNames = {},
}: FormTextFieldProps<T>) {
  const {
    wrapper = "",
    label: labelClass = "block text-md font-medium text-gray-500",
    input = "mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
    error: errorClass = "mt-1 text-red-500 text-sm",
  } = classNames;

  return (
    <div className={wrapper}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <Controller
        name={name}
        rules={rules}
        render={({ field, fieldState: { invalid, error } }) => (
          <>
            <InputText
              id={name}
              {...field}
              type={type}
              aria-invalid={invalid}
              className={`${input} ${invalid ? "p-invalid" : ""}`}
            />
            {error && (
              <small role="alert" className={errorClass}>
                {error.message}
              </small>
            )}
          </>
        )}
      />
    </div>
  );
}
