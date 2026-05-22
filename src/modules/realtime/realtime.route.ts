import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { rateLimitByIp } from "../../middlewares/security.middleware";
import { publishConversationEvent, streamConversation } from "./realtime.controller";

const router = Router();

router.use(requireAuth);
router.get("/stream/:conversationId", rateLimitByIp(120, 60_000), streamConversation);
router.post("/publish", rateLimitByIp(60, 60_000), publishConversationEvent);

export default router;
