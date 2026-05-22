import prisma from "../../config/prisma";

export const getOrCreateConversation = async (
  propertyId: string,
  realtorId: string,
  clientPhone: string
) => {
  let conversation = await prisma.conversation.findUnique({
    where: {
      propertyId_clientPhone: {
        propertyId,
        clientPhone,
      },
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        propertyId,
        realtorId,
        clientPhone,
      },
    });
  }

  return conversation;
};

export const sendMessage = async (
  conversationId: string,
  senderType: "REALTOR" | "CLIENT",
  content: string,
  clientPhone?: string
) => {
  if (senderType === "CLIENT") {
    if (!clientPhone) {
      throw new Error("clientPhone is required for client messages");
    }

    const phoneCheck = await prisma.phoneVerification.findUnique({
      where: { phone: clientPhone },
    });

    if (!phoneCheck?.verified) {
      throw new Error("Phone not verified");
    }
  }

  return prisma.message.create({
    data: {
      conversationId,
      senderType,
      content,
    },
  });
};

export const getMessages = async (conversationId: string) => {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
};
