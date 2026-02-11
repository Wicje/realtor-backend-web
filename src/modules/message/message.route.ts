
import { Router } from "express";
import {
  startConversation,
  createMessage,
  fetchMessages,
} from "./message.controller";

const router = Router();

router.post("/conversation", startConversation);
router.post("/send", createMessage);
router.get("/:conversationId", fetchMessages);

export default router;
