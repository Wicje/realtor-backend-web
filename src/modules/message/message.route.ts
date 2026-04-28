import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import {
  startConversation,
  createMessage,
  fetchMessages,
} from "./message.controller";

const router = Router();

router.use(requireAuth);
router.post("/conversation", startConversation);
router.post("/send", createMessage);
router.get("/:conversationId", fetchMessages);

export default router;
