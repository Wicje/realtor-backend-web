import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { addRealtimeClient, broadcastRealtime } from "./realtime.service";

const canAccessConversation = async (conversationId: string, userId: string) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) return false;
  return conversation.realtorId === userId;
};

export const streamConversation = async (req: Request, res: Response) => {
  const user = req.user;
  const conversationId = Array.isArray(req.params.conversationId)
    ? req.params.conversationId[0]
    : req.params.conversationId;

  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const allowed = await canAccessConversation(conversationId, user.userId);
  if (!allowed) return res.status(403).json({ error: "Forbidden" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.write(`event: connected\ndata: ${JSON.stringify({ conversationId })}\n\n`);

  const key = `${user.userId}:${Date.now()}`;
  const remove = addRealtimeClient(conversationId, key, res);

  req.on("close", () => {
    remove();
  });
};

export const publishConversationEvent = async (req: Request, res: Response) => {
  const user = req.user;
  const { conversationId, event, payload } = req.body;

  if (!user) return res.status(401).json({ error: "Unauthorized" });
  if (!conversationId || !event) {
    return res.status(400).json({ error: "conversationId and event are required" });
  }

  const allowed = await canAccessConversation(conversationId, user.userId);
  if (!allowed) return res.status(403).json({ error: "Forbidden" });

  broadcastRealtime(conversationId, event, {
    by: user.userId,
    payload,
    at: new Date().toISOString(),
  });

  return res.json({ ok: true });
};
