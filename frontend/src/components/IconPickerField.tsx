import {
  useFormContext,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import type { IconOption } from '../utils/iconConfig';

interface IconPickerProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T, Path<T>>;
  options: IconOption[];
  classNames?: {
    wrapper?: string;
    label?: string;
    grid?: string;
    item?: string;
    error?: string;
  };
}

export function IconPicker<T extends FieldValues>({
  name,
  label,
  rules,
  options,
  classNames = {},
}: IconPickerProps<T>) {
  const { control } = useFormContext<T>();
  const {
    wrapper = '',
    label: labelClass = 'block text-md font-medium text-gray-500 mb-1',
    grid = 'grid grid-cols-[repeat(auto-fill,minmax(50px,1fr))] gap-2 max-h-48 overflow-y-auto',
    item = 'flex flex-col items-center justify-center p-2 border border-transparent rounded cursor-pointer transition',
    error: errorClass = 'mt-1 text-red-500 text-sm',
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
        render={({ field, fieldState: { error } }) => (
          <>
            <div className={grid} role="listbox" aria-label={label}>
              {options.map((opt) => {
                const isSelected = field.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    id={`${String(name)}-${opt.value}`}
                    className={`
                      ${item}
                      ${isSelected ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-100'}
                    `}
                    onClick={() => field.onChange(opt.value)}
                    aria-selected={isSelected}
                  >
                    <i className={opt.value} aria-hidden="true" />
                    <span className="text-xs mt-1 text-center">{opt.label}</span>
                  </button>
                );
              })}
            </div>

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

export default IconPicker;