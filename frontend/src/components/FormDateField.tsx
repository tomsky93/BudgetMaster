import { useFormContext, Controller, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { parseISO, format } from 'date-fns';

interface FormDateFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T, Path<T>>;
  view?: 'month' | 'year' | 'date';
  dateFormat?: 'yy-mm-dd' | 'yy-mm' | 'dd/mm/yy';
}

export function FormDateField<T extends FieldValues>({
  name,
  label,
  rules,
  view = 'date',
  dateFormat = 'yy-mm-dd',
}: FormDateFieldProps<T>) {
  const {
    control,
  } = useFormContext<T>();

  return (
    <div className="field">
      <label htmlFor={String(name)}>{label}</label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <Calendar
              id={String(name)}
              value={field.value ? parseISO(field.value) : null}
              onChange={(e) =>
                field.onChange(format(e.value as Date, 'yyyy-MM-dd'))
              }
              dateFormat={dateFormat}
              view={view}
              className={fieldState.invalid ? 'p-invalid' : ''}
            />
            {fieldState.error && (
              <small className="p-error">{fieldState.error.message}</small>
            )}
          </>
        )}
      />
    </div>
  );
}
