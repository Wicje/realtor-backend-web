
import { prisma } from "../../config/db";

interface CreatePropertyInput {
  title: string;
  description: string;
  type: any;
  size: string;
  furnished: boolean;
  price: number;
  priceMode: any;
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
      visitors: 0,
      totalLeads: 0,
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

