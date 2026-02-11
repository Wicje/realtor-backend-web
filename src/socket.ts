
import { io } from "./server";
import prisma from "./config/prisma";

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    socket.data.user = decoded; // attach user info to socket
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join conversation room
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

    if (!isRealtor && !isClient) {
      return; // silently ignore
    }

    socket.join(conversationId);
  });
}); 

// Send message
  socket.on("send_message", async (data) => {
    const { conversationId, senderType, content } = data;

    // Save to DB first (always persist first)
    const message = await prisma.message.create({
      data: {
        conversationId,
        content,
      },
    });
    senderType,

    // Broadcast to everyone in room
    io.to(conversationId).emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
