import { Request, Response } from "express";
import { asyncHandler, getUserId } from "../middleware";
import * as formConfigService from "../services/formConfig.service";

export const listFormConfigs = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await formConfigService.listActiveFormConfigs();

    res.status(200).json({
      success: true,
      data,
    });
  }
);

export const getFormConfig = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await formConfigService.getFormConfigById(String(req.params.id));

    res.status(200).json({
      success: true,
      data,
    });
  }
);
