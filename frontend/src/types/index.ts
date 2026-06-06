export type FieldType = "text" | "select" | "radio";

export type SubmissionStatus = "draft" | "completed";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  details?: unknown;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: FieldOption[];
  validation?: FieldValidation;
}

export interface FormStep {
  id: string;
  title: string;
  order: number;
  fields: FormField[];
}

export interface FormConfig {
  id: string;
  slug: string;
  title: string;
  description?: string;
  steps: FormStep[];
}

export interface FormConfigListItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  stepCount: number;
}

export type SubmissionAnswers = Record<string, string>;

export interface SubmissionProgress {
  completedSteps: number;
  totalSteps: number;
}

export interface Submission {
  id: string;
  userId: string;
  formConfigId: string;
  title: string;
  status: SubmissionStatus;
  currentStepIndex: number;
  completedStepIds: string[];
  answers: SubmissionAnswers;
  progress: SubmissionProgress;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionListItem {
  id: string;
  title: string;
  status: SubmissionStatus;
  progress: SubmissionProgress;
  updatedAt: string;
}

export interface FieldErrors {
  [fieldId: string]: string;
}
