import { Router } from "express";
import { createListing, myListings } from "./listings.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";
import { requirePropertyLimit } from "../../middlewares/plan.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireRole(["REALTOR"]));

router.post("/", requirePropertyLimit, createListing);
router.get("/me", myListings);

export default router;

