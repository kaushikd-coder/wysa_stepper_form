import { FieldErrors, FormField, FormStep, SubmissionAnswers } from "@/types";

const isEmpty = (value: string | undefined): boolean =>
  !value || value.trim().length === 0;

const validateTextField = (field: FormField, value: string): string | null => {
  const rules = field.validation;

  if (rules?.minLength && value.length < rules.minLength) {
    return `${field.label} must be at least ${rules.minLength} characters`;
  }

  if (rules?.maxLength && value.length > rules.maxLength) {
    return `${field.label} must be at most ${rules.maxLength} characters`;
  }

  if (rules?.min !== undefined || rules?.max !== undefined) {
    const number = Number(value);

    if (Number.isNaN(number)) {
      return `${field.label} must be a valid number`;
    }

    if (rules.min !== undefined && number < rules.min) {
      return `${field.label} must be at least ${rules.min}`;
    }

    if (rules.max !== undefined && number > rules.max) {
      return `${field.label} must be at most ${rules.max}`;
    }
  }

  return null;
};

const validateOptionField = (field: FormField, value: string): string | null => {
  const isValid = field.options?.some((option) => option.value === value);

  if (!isValid) {
    return `${field.label} has an invalid option`;
  }

  return null;
};

export const validateField = (
  field: FormField,
  value: string | undefined,
  requireAll: boolean
): string | null => {
  if (isEmpty(value)) {
    return field.required && requireAll ? `${field.label} is required` : null;
  }

  const safeValue = value as string;

  if (field.type === "text") {
    return validateTextField(field, safeValue);
  }

  return validateOptionField(field, safeValue);
};

export const validateStep = (
  step: FormStep,
  answers: SubmissionAnswers,
  requireAll: boolean
): FieldErrors => {
  const errors: FieldErrors = {};

  for (const field of step.fields) {
    const error = validateField(field, answers[field.id], requireAll);

    if (error) {
      errors[field.id] = error;
    }
  }

  return errors;
};

export const validateAllSteps = (
  steps: FormStep[],
  answers: SubmissionAnswers
): FieldErrors => {
  let errors: FieldErrors = {};

  for (const step of steps) {
    errors = { ...errors, ...validateStep(step, answers, true) };
  }

  return errors;
};

export const sortSteps = (steps: FormStep[]): FormStep[] =>
  [...steps].sort((a, b) => a.order - b.order);

/** Tab is clickable for steps the user has already reached. */
export const isStepTabEnabled = (
  stepIndex: number,
  maxStepReached: number,
  isFormCompleted: boolean
): boolean => {
  if (isFormCompleted) {
    return true;
  }

  return stepIndex <= maxStepReached;
};

export const formatDisplayDate = (value: string): string => {
  const date = new Date(value);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const getApiErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return "Something went wrong. Please try again.";
};
