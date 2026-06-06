import { FieldErrors, FormField, SubmissionAnswers } from "@/types";
import { cn } from "@/lib/cn";

interface DynamicFieldProps {
  field: FormField;
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (fieldId: string, value: string) => void;
}

export function DynamicField({
  field,
  value,
  error,
  disabled = false,
  onChange,
}: DynamicFieldProps) {
  const label = (
    <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium">
      {field.label}
      {field.required && <span className="text-red-500"> *</span>}
    </label>
  );

  const errorMessage = error ? (
    <p className="mt-1 text-sm text-red-500">{error}</p>
  ) : null;

  if (field.type === "radio") {
    return (
      <div>
        {label}
        <div className="space-y-2">
          {field.options?.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <input
                type="radio"
                name={field.id}
                value={option.value}
                checked={value === option.value}
                disabled={disabled}
                onChange={() => onChange(field.id, option.value)}
                className="h-4 w-4 accent-primary"
              />
              {option.label}
            </label>
          ))}
        </div>
        {errorMessage}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        {label}
        <select
          id={field.id}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(field.id, event.target.value)}
          className={cn(
            "w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
            error ? "border-red-400" : "border-border"
          )}
        >
          <option value="">Select an option</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errorMessage}
      </div>
    );
  }

  return (
    <div>
      {label}
      <input
        id={field.id}
        type="text"
        value={value}
        disabled={disabled}
        placeholder={field.placeholder}
        onChange={(event) => onChange(field.id, event.target.value)}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
          error ? "border-red-400" : "border-border"
        )}
      />
      {errorMessage}
    </div>
  );
}

interface FormFieldsProps {
  fields: FormField[];
  answers: SubmissionAnswers;
  errors: FieldErrors;
  disabled?: boolean;
  onChange: (fieldId: string, value: string) => void;
}

export function FormFields({
  fields,
  answers,
  errors,
  disabled = false,
  onChange,
}: FormFieldsProps) {
  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          value={answers[field.id] ?? ""}
          error={errors[field.id]}
          disabled={disabled}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
