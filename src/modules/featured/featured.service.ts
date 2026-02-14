
import { prisma } from "../../config/db";
import crypto from "crypto";

export const createFeaturedLink = async (
  realtorId: string,
  propertyIds: string[]
) => {
  const token = crypto.randomUUID();

  return prisma.featuredLink.create({
    data: {
      token,
      realtorId,
      properties: {
        connect: propertyIds.map((id) => ({ id })),
      },
    },
  });
};

export const getFeaturedProperties = async (token: string) => {
  const link = await prisma.featuredLink.findUnique({
    where: { token },
    include: {
      properties: true,
    },
  });

  if (!link) {
    throw new Error("Featured link not found");
  }

  return link.properties;
};
