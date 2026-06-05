export const FIELD_TYPES = {
  TEXT: "text",
  SELECT: "select",
  RADIO: "radio",
} as const;

export type FieldType = (typeof FIELD_TYPES)[keyof typeof FIELD_TYPES];

export const SUBMISSION_STATUS = {
  DRAFT: "draft",
  COMPLETED: "completed",
} as const;

export type SubmissionStatus =
  (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];

export const DEFAULT_USER_ID = "demo-user";
