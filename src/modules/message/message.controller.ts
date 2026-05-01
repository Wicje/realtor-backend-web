import { Request, Response } from "express";
import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
} from "./message.service";

export const startConversation = async (req: Request, res: Response) => {
  const { propertyId, clientPhone } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const convo = await getOrCreateConversation(propertyId, user.userId, clientPhone);
    return res.json(convo);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return res.status(400).json({ error: message });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const { conversationId, content, senderType, clientPhone } = req.body;

  try {
    const message = await sendMessage(conversationId, senderType, content, clientPhone);
    return res.json(message);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return res.status(400).json({ error: message });
  }
};

export const fetchMessages = async (req: Request, res: Response) => {
  const conversationId = Array.isArray(req.params.conversationId) ? req.params.conversationId[0] : req.params.conversationId;

  const messages = await getMessages(conversationId);
  return res.json(messages);
};
