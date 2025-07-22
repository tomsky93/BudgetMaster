import {
  Controller,
  RegisterOptions,
  Path,
  FieldValues,
} from "react-hook-form";
import { Dropdown } from "primereact/dropdown";

interface SelectOption<V> {
  label: string;
  value: string | number | V;
}

interface FormSelectFieldProps<T extends FieldValues, V = string | number> {
  name: Path<T>;
  label: string;
  options: SelectOption<V>[];
  rules?: RegisterOptions<T, Path<T>>;
  placeholder?: string;
}

export function FormSelectField<T extends FieldValues, V>({
  name,
  label,
  options,
  rules,
  placeholder = "Select an option",
}: FormSelectFieldProps<T, V>) { 
  return (
    <div className="field">
      <label htmlFor={name} className="block text-md font-medium text-gray-500">
        {label}
      </label>
      <Controller
        name={name}
        rules={rules}
        render={({ field, fieldState: { invalid, error } }) => (
          <>
            <Dropdown
              id={name}
              {...field}
              options={options}
              optionLabel="label"
              optionValue="value"
              placeholder={placeholder}
              className={`w-full ${invalid ? "p-invalid" : ""}`}
            />
            {error && (
              <small role="alert" className="mt-1 text-red-500 text-sm">
                {error.message}
              </small>
            )}
          </>
        )}
      />
    </div>
  );
}
