import {
  useFormContext,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";

interface FormNumberFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T, Path<T>>;
  classNames?: {
    wrapper?: string;
    label?: string;
    input?: string;
    error?: string;
  };
}

export function FormNumberField<T extends FieldValues>({
  name,
  label,
  rules,
  classNames = {},
}: FormNumberFieldProps<T>) {
  const { control } = useFormContext<T>();
  const {
    wrapper = "",
    label: labelClass = "block text-md font-medium text-gray-500",
    error: errorClass = "mt-1 text-red-500 text-sm",
  } = classNames;

  return (
    <div className={wrapper}>
      <label htmlFor={String(name)} className={labelClass}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { invalid, error } }) => (
          <>
            <InputNumber
              id={String(name)}
              value={field.value}
              onValueChange={(e) => field.onChange(e.value)}
              mode="decimal"
              minFractionDigits={2}
              min={0.01}
              aria-invalid={invalid}
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
