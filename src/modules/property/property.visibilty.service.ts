
import prisma from "../../config/prisma";

export const togglePropertyVisibility = async (
  propertyId: string,
  realtorId: string,
  isPublic: boolean
) => {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, realtorId },
  });

  if (!property) throw new Error("Property not found or not owned by you");

  return prisma.property.update({
    where: { id: propertyId },
    data: { isPublic },
  });
};

export const allowClientAccess = async (
  propertyId: string,
  realtorId: string,
  phone: string
) => {
  // ensure realtor owns property
  const property = await prisma.property.findFirst({
    where: { id: propertyId, realtorId },
  });

  if (!property) throw new Error("Property not found");

  return prisma.propertyVisibility.create({
    data: {
      propertyId,
      phone,
    },
  });
};

export const removeClientAccess = async (
  propertyId: string,
  realtorId: string,
  phone: string
) => {
  const property = await prisma.property.findFirst({
    where: { id: propertyId, realtorId },
  });

  if (!property) throw new Error("Property not found");

  return prisma.propertyVisibility.delete({
    where: {
      propertyId_phone: {
        propertyId,
        phone,
      },
    },
  });
};
