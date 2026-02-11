import { prisma } from "../../config/db";
import { trackEvent } from "../analytics/analytics.service";

export const createLead = async (
  propertyId: string,
  phone: string,
  message: string
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  return prisma.lead.create({
    data: {
      propertyId,
      realtorId: property.realtorId,
      phone,
      message,
      isPhoneVerified: false,
    },
  });
};

await trackEvent("LEAD", property.realtorId, property.id);

export const getLeadsForRealtor = async (realtorId: string) => {
  return prisma.lead.findMany({
    where: { realtorId },
    orderBy: { createdAt: "desc" },
  });
};
