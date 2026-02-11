
import {
  getOrCreateConversation,
  sendMessage,
  getMessages,
} from "./message.service";

export const startConversation = async (req, res) => {
  const { propertyId, clientPhone } = req.body;

  try {
    const convo = await getOrCreateConversation(
      propertyId,
      req.user.id,
      clientPhone
    );

    res.json(convo);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const createMessage = async (req, res) => {
  const { conversationId, content, senderType } = req.body;

  const message = await sendMessage(conversationId, senderType, content);
  res.json(message);
};

export const fetchMessages = async (req, res) => {
  const { conversationId } = req.params;

  const messages = await getMessages(conversationId);
  res.json(messages);
};
