import { Router } from "express";
import { toggleVisibilty, allowAccess, removeAccess } from "./property.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

router.patch("/:id/visibility", authMiddleware, toggleVisibility);

router.post("/:id/allow", authMiddleware, allowAccess);

router.delete("/:id/allow", authMiddleware, removeAccess);
