import { Router } from "express";
import formConfigRoutes from "./formConfig.routes";
import submissionRoutes from "./submission.routes";

const router = Router();

router.use("/form-configs", formConfigRoutes);
router.use("/submissions", submissionRoutes);

export default router;
