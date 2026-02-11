
import { Router } from "express";
import { submitLead, myLeads } from "./leads.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

// Public: visitors submit lead
router.post("/", submitLead);

// Protected: realtor views leads
router.get("/me", requireAuth, myLeads);

export default router;
