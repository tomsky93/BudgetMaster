import { Controller, RegisterOptions, Path, FieldValues } from 'react-hook-form';
import { ColorPicker, ColorPickerChangeEvent } from 'primereact/colorpicker';

interface ColorPickerFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  //control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
}

export function ColorPickerField<T extends FieldValues>({
  name,
  label,
  rules,
}: ColorPickerFieldProps<T>) {
  return (
    <Controller
      name={name}
      rules={rules}
      render={({
        field: { value, onChange },
        fieldState: { invalid, error },
      }) => (
        <div className="field">
          {label && (
            <label htmlFor={name} className="block text-md font-medium text-gray-500">
              {label}
            </label>
          )}
          <ColorPicker
            id={name}
            value={value}
            format="hex"
            onChange={(e: ColorPickerChangeEvent) => onChange(e.value as string)}
            className={`w-full ${invalid ? 'p-invalid' : ''}`}
          />
          {error && (
            <small role="alert" className='mt-1 text-red-500 text-sm'>
              {error.message}
            </small>
          )}
        </div>
      )}
    />
  );
}

export default ColorPickerField;
