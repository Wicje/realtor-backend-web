
import { io } from "./server";
import prisma from "./config/prisma";
import jwt from "jsonwebtoken";

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    socket.data.user = decoded;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_conversation", async (conversationId: string) => {
    const user = socket.data.user;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) return;

    const isRealtor =
      user.role === "REALTOR" &&
      conversation.realtorId === user.id;

    const isClient =
      user.phone &&
      conversation.clientPhone === user.phone;

    if (!isRealtor && !isClient) return;

    socket.join(conversationId);
  });

  socket.on("send_message", async (data) => {
    const { conversationId, content } = data;

    const user = socket.data.user;

    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
        senderId: user.id, // much better than senderType
      },
    });

    io.to(conversationId).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

