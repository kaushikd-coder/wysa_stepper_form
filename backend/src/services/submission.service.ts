import { DEFAULT_USER_ID, SUBMISSION_STATUS } from "../constants";
import { FormConfig, Submission } from "../models";
import { SubmissionAnswers, SubmissionDocument } from "../types";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/AppError";
import { isValidObjectId } from "../utils/mongooseHelpers";
import {
  buildSubmissionTitle,
  calculateProgress,
  getSortedSteps,
  mergeAnswers,
  normalizeAnswers,
} from "../utils/submissionHelpers";
import { getActiveFormConfigDocument } from "./formConfig.service";
import {
  validateCompletedStepIds,
  validateProvidedAnswers,
  validateStepIndex,
} from "./fieldValidation.service";
import {
  CompleteSubmissionInput,
  CreateSubmissionInput,
  SaveDraftInput,
} from "../validations/submission.validation";

const formatSubmission = (
  submission: SubmissionDocument & { _id: { toString(): string } },
  totalSteps: number
) => ({
  id: submission._id.toString(),
  userId: submission.userId,
  formConfigId: submission.formConfigId,
  title: submission.title,
  status: submission.status,
  currentStepIndex: submission.currentStepIndex,
  completedStepIds: submission.completedStepIds,
  answers: submission.answers as SubmissionAnswers,
  progress: {
    completedSteps: submission.completedStepIds.length,
    totalSteps,
  },
  createdAt: submission.createdAt,
  updatedAt: submission.updatedAt,
});

const getSubmissionOrThrow = async (id: string, userId: string) => {
  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid submission id");
  }

  const submission = await Submission.findOne({ _id: id, userId });

  if (!submission) {
    throw new NotFoundError("Submission not found");
  }

  return submission;
};

const getFormConfigForSubmission = async (formConfigId: string) => {
  const formConfig = await FormConfig.findById(formConfigId).lean();

  if (!formConfig) {
    throw new NotFoundError("Form configuration not found for submission");
  }

  return formConfig;
};

export const listSubmissions = async (userId: string = DEFAULT_USER_ID) => {
  const submissions = await Submission.find({ userId })
    .select("title status completedStepIds formConfigId updatedAt createdAt")
    .sort({ updatedAt: -1 })
    .lean();

  const formConfigIds = [...new Set(submissions.map((item) => item.formConfigId))];
  const formConfigs = await FormConfig.find({ _id: { $in: formConfigIds } })
    .select("steps")
    .lean();

  const stepCountByFormId = new Map(
    formConfigs.map((config) => [config._id.toString(), config.steps.length])
  );

  return submissions.map((submission) => ({
    id: submission._id.toString(),
    title: submission.title,
    status: submission.status,
    progress: {
      completedSteps: submission.completedStepIds.length,
      totalSteps: stepCountByFormId.get(submission.formConfigId) ?? 0,
    },
    updatedAt: submission.updatedAt,
  }));
};

export const createSubmission = async (
  input: CreateSubmissionInput,
  userId: string = DEFAULT_USER_ID
) => {
  const formConfig = await getActiveFormConfigDocument(input.formConfigId);
  const sortedSteps = getSortedSteps(formConfig.steps);

  const submission = await Submission.create({
    userId: input.userId ?? userId,
    formConfigId: formConfig._id.toString(),
    title: buildSubmissionTitle(formConfig.title),
    status: SUBMISSION_STATUS.DRAFT,
    currentStepIndex: 0,
    completedStepIds: [],
    answers: {},
  });

  return formatSubmission(submission, sortedSteps.length);
};

export const getSubmissionById = async (
  id: string,
  userId: string = DEFAULT_USER_ID
) => {
  const submission = await getSubmissionOrThrow(id, userId);
  const formConfig = await getFormConfigForSubmission(submission.formConfigId);

  return formatSubmission(submission, formConfig.steps.length);
};

export const saveDraft = async (
  id: string,
  input: SaveDraftInput,
  userId: string = DEFAULT_USER_ID
) => {
  const submission = await getSubmissionOrThrow(id, userId);

  if (submission.status === SUBMISSION_STATUS.COMPLETED) {
    throw new ConflictError("Completed submissions cannot be edited");
  }

  const formConfig = await getActiveFormConfigDocument(submission.formConfigId);
  const sortedSteps = getSortedSteps(formConfig.steps);

  const stepIssue = validateStepIndex(sortedSteps, input.currentStepIndex);
  const completedStepIssues = validateCompletedStepIds(
    sortedSteps,
    input.completedStepIds
  );
  const normalizedAnswers = normalizeAnswers(input.answers);
  const answerIssues = validateProvidedAnswers(sortedSteps, normalizedAnswers, {
    requireAllRequired: false,
  });

  const issues = [
    ...(stepIssue ? [stepIssue] : []),
    ...completedStepIssues,
    ...answerIssues,
  ];

  if (issues.length > 0) {
    throw new ValidationError("Draft contains invalid data", issues);
  }

  submission.currentStepIndex = input.currentStepIndex;
  submission.completedStepIds = input.completedStepIds;
  submission.answers = mergeAnswers(
    submission.answers as SubmissionAnswers,
    normalizedAnswers
  );

  await submission.save();

  return formatSubmission(submission, sortedSteps.length);
};

export const completeSubmission = async (
  id: string,
  input: CompleteSubmissionInput,
  userId: string = DEFAULT_USER_ID
) => {
  const submission = await getSubmissionOrThrow(id, userId);

  if (submission.status === SUBMISSION_STATUS.COMPLETED) {
    throw new ConflictError("Submission is already completed");
  }

  const formConfig = await getActiveFormConfigDocument(submission.formConfigId);
  const sortedSteps = getSortedSteps(formConfig.steps);
  const normalizedAnswers = normalizeAnswers(input.answers);
  const answerIssues = validateProvidedAnswers(sortedSteps, normalizedAnswers, {
    requireAllRequired: true,
  });

  if (answerIssues.length > 0) {
    throw new ValidationError(
      "Submission cannot be completed due to validation errors",
      answerIssues
    );
  }

  submission.answers = normalizedAnswers;
  submission.completedStepIds = sortedSteps.map((step) => step.id);
  submission.currentStepIndex = Math.max(sortedSteps.length - 1, 0);
  submission.status = SUBMISSION_STATUS.COMPLETED;

  await submission.save();

  return formatSubmission(submission, sortedSteps.length);
};

export const deleteSubmission = async (
  id: string,
  userId: string = DEFAULT_USER_ID
): Promise<void> => {
  const submission = await getSubmissionOrThrow(id, userId);
  await submission.deleteOne();
};
