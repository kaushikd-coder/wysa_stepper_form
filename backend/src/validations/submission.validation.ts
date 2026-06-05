import { z } from "zod";
import { SUBMISSION_STATUS } from "../constants";

export const submissionAnswersSchema = z.record(
  z.union([z.string(), z.array(z.string())])
);

export const createSubmissionSchema = z.object({
  formConfigId: z.string().min(1),
  userId: z.string().min(1).optional(),
});

export const saveDraftSchema = z.object({
  currentStepIndex: z.number().int().min(0),
  completedStepIds: z.array(z.string()).default([]),
  answers: submissionAnswersSchema.default({}),
});

export const completeSubmissionSchema = z.object({
  answers: submissionAnswersSchema,
});

export const submissionStatusSchema = z.enum([
  SUBMISSION_STATUS.DRAFT,
  SUBMISSION_STATUS.COMPLETED,
]);

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type SaveDraftInput = z.infer<typeof saveDraftSchema>;
export type CompleteSubmissionInput = z.infer<typeof completeSubmissionSchema>;
