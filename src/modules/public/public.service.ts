
import { prisma } from "../../config/db";


const ALLOWED_PROPERTY_TYPES = new Set(["SHOP", "RESIDENTIAL", "WAREHOUSE", "DUPLEX", "BUNGALOW", "LAND"]);
const ALLOWED_PRICE_MODES = new Set(["RENT", "LEASE", "ONE_TIME"]);

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
      ...(filters.type && ALLOWED_PROPERTY_TYPES.has(filters.type) && { type: filters.type }),
      ...(filters.priceMode && ALLOWED_PRICE_MODES.has(filters.priceMode) && { priceMode: filters.priceMode }),
      ...(filters.minPrice !== undefined && { price: { gte: filters.minPrice } }),
      ...(filters.maxPrice !== undefined && { price: { lte: filters.maxPrice } }),
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
