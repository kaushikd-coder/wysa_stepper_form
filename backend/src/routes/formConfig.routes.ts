import { Router } from "express";
import {
  getFormConfig,
  listFormConfigs,
} from "../controllers/formConfig.controller";
import { validateParams } from "../middleware";
import { objectIdParamSchema } from "../validations/params.validation";

const router = Router();

router.get("/", listFormConfigs);
router.get("/:id", validateParams(objectIdParamSchema), getFormConfig);

export default router;
