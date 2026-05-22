import { prisma } from "../../config/db";

interface CreatePropertyInput {
  title: string;
  description: string;
  type: "SHOP" | "RESIDENTIAL" | "WAREHOUSE" | "DUPLEX" | "BUNGALOW" | "LAND";
  size: string;
  furnished: boolean;
  price: number;
  priceMode: "RENT" | "LEASE" | "ONE_TIME";
  state: string;
  city: string;
  street: string;
  images: string[];
}

export const createProperty = async (
  realtorId: string,
  data: CreatePropertyInput
) => {
  return prisma.property.create({
    data: {
      ...data,
      realtorId,
    },
  });
};

export const getMyProperties = async (realtorId: string) => {
  return prisma.property.findMany({
    where: { realtorId },
    orderBy: { createdAt: "desc" },
  });
};

export const getPropertyById = async (id: string) => {
  return prisma.property.findUnique({
    where: { id },
  });
};
