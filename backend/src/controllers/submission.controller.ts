import { Request, Response } from "express";
import { asyncHandler, getUserId } from "../middleware";
import * as submissionService from "../services/submission.service";
import {
  CompleteSubmissionInput,
  CreateSubmissionInput,
  SaveDraftInput,
} from "../validations/submission.validation";

export const listSubmissions = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await submissionService.listSubmissions(getUserId(req));

    res.status(200).json({
      success: true,
      data,
    });
  }
);

export const createSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await submissionService.createSubmission(
      req.body as CreateSubmissionInput,
      getUserId(req)
    );

    res.status(201).json({
      success: true,
      data,
    });
  }
);

export const getSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await submissionService.getSubmissionById(
      String(req.params.id),
      getUserId(req)
    );

    res.status(200).json({
      success: true,
      data,
    });
  }
);

export const saveDraft = asyncHandler(async (req: Request, res: Response) => {
  const data = await submissionService.saveDraft(
    String(req.params.id),
    req.body as SaveDraftInput,
    getUserId(req)
  );

  res.status(200).json({
    success: true,
    data,
  });
});

export const completeSubmission = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await submissionService.completeSubmission(
      String(req.params.id),
      req.body as CompleteSubmissionInput,
      getUserId(req)
    );

    res.status(200).json({
      success: true,
      data,
    });
  }
);
