
import { prisma } from "../../config/db";
import crypto from "crypto";

export const createFeaturedLink = async (
  realtorId: string,
  propertyIds: string[]
) => {
  const token = crypto.randomUUID();
  
  
const ownedProperties = await prisma.property.findMany({
  where: {
    id: { in: propertyIds },
    realtorId,
  },
});

if (ownedProperties.length !== propertyIds.length) {
  throw new Error("Some properties do not belong to you");
}

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
