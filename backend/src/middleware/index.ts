import { NextFunction, Request, Response } from "express";
import { DEFAULT_USER_ID } from "../constants";
import { ZodSchema } from "zod";
import { ValidationError } from "../utils/AppError";

export const asyncHandler =
  <T extends Request>(
    handler: (req: T, res: Response, next: NextFunction) => Promise<void>
  ) =>
  (req: T, res: Response, next: NextFunction): void => {
    void handler(req, res, next).catch(next);
  };

export const validateBody =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new ValidationError("Invalid request body", result.error.flatten())
      );
      return;
    }

    req.body = result.data;
    next();
  };

export const validateParams =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      next(
        new ValidationError("Invalid request params", result.error.flatten())
      );
      return;
    }

    req.params = result.data as Request["params"];
    next();
  };

export const getUserId = (req: Request): string => {
  const headerUserId = req.header("x-user-id");

  if (headerUserId && headerUserId.trim().length > 0) {
    return headerUserId.trim();
  }

  const queryUserId = req.query.userId;

  if (typeof queryUserId === "string" && queryUserId.trim().length > 0) {
    return queryUserId.trim();
  }

  return DEFAULT_USER_ID;
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
    return;
  }

  if (error instanceof Error && "statusCode" in error) {
    const appError = error as Error & { statusCode: number; details?: unknown };

    res.status(appError.statusCode).json({
      success: false,
      message: appError.message,
      details: appError.details,
    });
    return;
  }

  console.error("Unhandled error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
