import mongoose from "mongoose";
import { SUBMISSION_STATUS } from "../constants";
import { SubmissionDocument } from "../types";

const submissionSchema = new mongoose.Schema<SubmissionDocument>(
  {
    userId: { type: String, required: true, trim: true, index: true },
    formConfigId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(SUBMISSION_STATUS),
      default: SUBMISSION_STATUS.DRAFT,
    },
    currentStepIndex: { type: Number, required: true, default: 0, min: 0 },
    completedStepIds: { type: [String], default: [] },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

submissionSchema.index({ userId: 1, status: 1, updatedAt: -1 });
submissionSchema.index({ userId: 1, formConfigId: 1 });

export const Submission = mongoose.model<SubmissionDocument>(
  "Submission",
  submissionSchema
);
