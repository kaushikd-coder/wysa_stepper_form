import { FormStep, SubmissionAnswers, SubmissionProgress } from "../types";

export const calculateProgress = (
  completedStepIds: string[],
  steps: FormStep[]
): SubmissionProgress => ({
  completedSteps: completedStepIds.length,
  totalSteps: steps.length,
});

export const buildSubmissionTitle = (
  formTitle: string,
  createdAt: Date = new Date()
): string => {
  const formattedDate = createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${formTitle} - ${formattedDate}`;
};

export const normalizeAnswers = (
  answers: SubmissionAnswers
): SubmissionAnswers => {
  const normalized: SubmissionAnswers = {};

  for (const [key, value] of Object.entries(answers)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      normalized[key] = value.map(String);
    } else {
      normalized[key] = String(value);
    }
  }

  return normalized;
};

export const mergeAnswers = (
  existing: SubmissionAnswers,
  incoming: SubmissionAnswers
): SubmissionAnswers => ({
  ...existing,
  ...incoming,
});

export const getSortedSteps = (steps: FormStep[]): FormStep[] =>
  [...steps].sort((a, b) => a.order - b.order);

export const getStepByIndex = (
  steps: FormStep[],
  stepIndex: number
): FormStep | undefined => getSortedSteps(steps)[stepIndex];

export const getAllFields = (steps: FormStep[]) =>
  getSortedSteps(steps).flatMap((step) => step.fields);

export const getFieldIds = (steps: FormStep[]): Set<string> =>
  new Set(getAllFields(steps).map((field) => field.id));

export const getStepIds = (steps: FormStep[]): Set<string> =>
  new Set(getSortedSteps(steps).map((step) => step.id));
