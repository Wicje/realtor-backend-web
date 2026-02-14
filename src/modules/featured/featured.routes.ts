
import { Router } from "express";
import { createLink, viewFeatured } from "./featured.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, createLink);   // realtor creates link
router.get("/:token", viewFeatured);        // client views link

export default router;
