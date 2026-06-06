import { SubmissionAnswers } from "@/types";

export const answersAreEqual = (
  current: SubmissionAnswers,
  saved: SubmissionAnswers
): boolean => JSON.stringify(current) === JSON.stringify(saved);
