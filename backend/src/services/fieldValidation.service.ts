import { FIELD_TYPES } from "../constants";
import { FormField, FormStep } from "../types";
import {
  getAllFields,
  getFieldIds,
  getSortedSteps,
  getStepIds,
} from "../utils/submissionHelpers";

export interface FieldValidationIssue {
  fieldId: string;
  message: string;
}

const isEmptyValue = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
};

const validateTextField = (
  field: FormField,
  value: string
): FieldValidationIssue | null => {
  const rules = field.validation;

  if (rules?.minLength !== undefined && value.length < rules.minLength) {
    return {
      fieldId: field.id,
      message: `${field.label} must be at least ${rules.minLength} characters`,
    };
  }

  if (rules?.maxLength !== undefined && value.length > rules.maxLength) {
    return {
      fieldId: field.id,
      message: `${field.label} must be at most ${rules.maxLength} characters`,
    };
  }

  if (rules?.min !== undefined || rules?.max !== undefined) {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return {
        fieldId: field.id,
        message: `${field.label} must be a valid number`,
      };
    }

    if (rules.min !== undefined && numericValue < rules.min) {
      return {
        fieldId: field.id,
        message: `${field.label} must be at least ${rules.min}`,
      };
    }

    if (rules.max !== undefined && numericValue > rules.max) {
      return {
        fieldId: field.id,
        message: `${field.label} must be at most ${rules.max}`,
      };
    }
  }

  if (rules?.pattern) {
    const regex = new RegExp(rules.pattern);

    if (!regex.test(value)) {
      return {
        fieldId: field.id,
        message: `${field.label} has an invalid format`,
      };
    }
  }

  return null;
};

const validateOptionField = (
  field: FormField,
  value: string
): FieldValidationIssue | null => {
  const allowedValues = new Set(field.options?.map((option) => option.value));

  if (!allowedValues.has(value)) {
    return {
      fieldId: field.id,
      message: `${field.label} has an invalid option`,
    };
  }

  return null;
};

export const validateFieldValue = (
  field: FormField,
  value: unknown,
  options: { requireValue: boolean }
): FieldValidationIssue | null => {
  if (isEmptyValue(value)) {
    if (options.requireValue && field.required) {
      return {
        fieldId: field.id,
        message: `${field.label} is required`,
      };
    }

    return null;
  }

  if (typeof value !== "string") {
    return {
      fieldId: field.id,
      message: `${field.label} must be a string value`,
    };
  }

  switch (field.type) {
    case FIELD_TYPES.TEXT:
      return validateTextField(field, value);
    case FIELD_TYPES.SELECT:
    case FIELD_TYPES.RADIO:
      return validateOptionField(field, value);
    default:
      return {
        fieldId: field.id,
        message: `Unsupported field type for ${field.label}`,
      };
  }
};

export const validateProvidedAnswers = (
  steps: FormStep[],
  answers: Record<string, unknown>,
  options: { requireAllRequired: boolean }
): FieldValidationIssue[] => {
  const fields = getAllFields(steps);
  const knownFieldIds = getFieldIds(steps);
  const issues: FieldValidationIssue[] = [];

  for (const fieldId of Object.keys(answers)) {
    if (!knownFieldIds.has(fieldId)) {
      issues.push({
        fieldId,
        message: `Unknown field "${fieldId}"`,
      });
    }
  }

  const fieldsToValidate = options.requireAllRequired
    ? fields
    : fields.filter((field) => Object.prototype.hasOwnProperty.call(answers, field.id));

  for (const field of fieldsToValidate) {
    const value = answers[field.id];
    const issue = validateFieldValue(field, value, {
      requireValue: options.requireAllRequired,
    });

    if (issue) {
      issues.push(issue);
    }
  }

  return issues;
};

export const validateStepIndex = (
  steps: FormStep[],
  stepIndex: number
): FieldValidationIssue | null => {
  const sortedSteps = getSortedSteps(steps);

  if (stepIndex < 0 || stepIndex >= sortedSteps.length) {
    return {
      fieldId: "currentStepIndex",
      message: `Step index ${stepIndex} is out of range`,
    };
  }

  return null;
};

export const validateCompletedStepIds = (
  steps: FormStep[],
  completedStepIds: string[]
): FieldValidationIssue[] => {
  const validStepIds = getStepIds(steps);
  const issues: FieldValidationIssue[] = [];

  for (const stepId of completedStepIds) {
    if (!validStepIds.has(stepId)) {
      issues.push({
        fieldId: "completedStepIds",
        message: `Unknown step "${stepId}"`,
      });
    }
  }

  return issues;
};

export const validateFormConfigStructure = (
  steps: FormStep[]
): FieldValidationIssue[] => {
  const issues: FieldValidationIssue[] = [];

  if (steps.length === 0) {
    issues.push({
      fieldId: "steps",
      message: "Form configuration must include at least one step",
    });
    return issues;
  }

  const stepIds = new Set<string>();
  const fieldIds = new Set<string>();

  for (const step of getSortedSteps(steps)) {
    if (stepIds.has(step.id)) {
      issues.push({
        fieldId: step.id,
        message: `Duplicate step id "${step.id}"`,
      });
    }

    stepIds.add(step.id);

    if (!step.fields.length) {
      issues.push({
        fieldId: step.id,
        message: `Step "${step.title}" must include at least one field`,
      });
    }

    for (const field of step.fields) {
      if (fieldIds.has(field.id)) {
        issues.push({
          fieldId: field.id,
          message: `Duplicate field id "${field.id}"`,
        });
      }

      fieldIds.add(field.id);

      const needsOptions =
        field.type === FIELD_TYPES.SELECT || field.type === FIELD_TYPES.RADIO;

      if (needsOptions && (!field.options || field.options.length === 0)) {
        issues.push({
          fieldId: field.id,
          message: `${field.type} field "${field.label}" is missing options`,
        });
      }
    }
  }

  return issues;
};
