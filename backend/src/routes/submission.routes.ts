import { Router } from "express";
import {
  completeSubmission,
  createSubmission,
  getSubmission,
  listSubmissions,
  saveDraft,
} from "../controllers/submission.controller";
import { validateBody, validateParams } from "../middleware";
import { objectIdParamSchema } from "../validations/params.validation";
import {
  completeSubmissionSchema,
  createSubmissionSchema,
  saveDraftSchema,
} from "../validations/submission.validation";

const router = Router();

router.get("/", listSubmissions);
router.post("/", validateBody(createSubmissionSchema), createSubmission);
router.get("/:id", validateParams(objectIdParamSchema), getSubmission);
router.patch(
  "/:id/draft",
  validateParams(objectIdParamSchema),
  validateBody(saveDraftSchema),
  saveDraft
);
router.post(
  "/:id/complete",
  validateParams(objectIdParamSchema),
  validateBody(completeSubmissionSchema),
  completeSubmission
);

export default router;
