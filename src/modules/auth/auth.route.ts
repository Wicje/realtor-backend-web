import { Router } from "express";
import { signup, login } from "./auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: (req as any).user });
});

// 🔐 Realtor-only route
router.post(
  "/realtor-only",
  requireAuth,
  requireRole(["REALTOR"]),
  (req, res) => {
    res.json({ message: "Welcome Realtor. You may proceed." });
  }
);

export default router;

