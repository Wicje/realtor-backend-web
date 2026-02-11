
import { prisma } from "../../config/db";

export const trackEvent = async (
  type: "VISIT" | "LEAD",
  realtorId: string,
  propertyId?: string
) => {
  return prisma.analyticsEvent.create({
    data: {
      type,
      realtorId,
      propertyId,
    },
  });
};

export const getRealtorStats = async (
  realtorId: string,
  from?: Date,
  to?: Date
) => {
  return prisma.analyticsEvent.groupBy({
    by: ["type"],
    where: {
      realtorId,
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    _count: true,
  });
};
