import { Router } from "express";
import { createListing, myListings } from "./listings.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

router.use(requireAuth);
router.use(requireRole(["REALTOR"]));

router.post("/", createListing);
router.get("/me", myListings);

export default router;

