
import { Router } from "express";
import { myAnalytics } from "./analytics.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/me", requireAuth, myAnalytics);

export default router;
