import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { PLANS } from "../config/plans";

export const requirePropertyLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const plan = PLANS[user.plan];

  if (!plan) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  const propertyCount = await prisma.property.count({
    where: { realtorId: user.userId },
  });

  if (propertyCount >= plan.maxProperties) {
    return res.status(403).json({
      error: "Property limit reached. Upgrade your plan.",
    });
  }

  return next();
};
