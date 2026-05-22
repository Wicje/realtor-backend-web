import { Router } from "express";
import { toggleVisibility, allowAccess, removeAccess } from "./property.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.patch("/:id/visibility", requireAuth, toggleVisibility);
router.post("/:id/allow", requireAuth, allowAccess);
router.delete("/:id/allow", requireAuth, removeAccess);

export default router;
