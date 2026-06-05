import { FieldType, SubmissionStatus } from "../constants";

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

export interface FormConfigDocument {
  slug: string;
  title: string;
  description?: string;
  steps: FormStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SubmissionAnswers = Record<string, string | string[]>;

export interface SubmissionDocument {
  userId: string;
  formConfigId: string;
  title: string;
  status: SubmissionStatus;
  currentStepIndex: number;
  completedStepIds: string[];
  answers: SubmissionAnswers;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubmissionProgress {
  completedSteps: number;
  totalSteps: number;
}

export interface SubmissionListItem {
  id: string;
  title: string;
  status: SubmissionStatus;
  progress: SubmissionProgress;
  updatedAt: Date;
}
