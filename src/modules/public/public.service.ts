
import { prisma } from "../../config/db";

export const getPublicRealtorPage = async (
  slug: string,
  filters: {
    type?: string;
    priceMode?: string;
    minPrice?: number;
    maxPrice?: number;
  }
) => {
  const realtor = await prisma.user.findUnique({
    where: { slug },
  });

  if (!realtor) throw new Error("Realtor not found");

  const properties = await prisma.property.findMany({
    where: {
      realtorId: realtor.id,
      isPublic: true,
      ...(filters.type && { type: filters.type as any }),
      ...(filters.priceMode && { priceMode: filters.priceMode as any }),
      ...(filters.minPrice && { price: { gte: filters.minPrice } }),
      ...(filters.maxPrice && { price: { lte: filters.maxPrice } }),
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    realtor: {
      slug: realtor.slug,
    },
    properties,
  };
};


export const getPublicProperty = async (slug: string, propertyId: string) => {
  const realtor = await prisma.user.findUnique({
    where: { slug },
  });

  if (!realtor) throw new Error("Realtor not found");

  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      realtorId: realtor.id,
      isPublic: true,
    },
  });

  if (!property) throw new Error("Property not found");

  return property;
};
