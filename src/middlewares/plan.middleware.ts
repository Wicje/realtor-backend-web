import { Request, Response, NextFunction } from "express";
import { PLANS } from "../config/plans";
import { getMyProperties } from "../modules/listings/listings.service";

export const requirePropertyLimit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  const plan = PLANS[user.plan];
  const myProperties = getMyProperties(user.userId);

  if (myProperties.length >= plan.maxProperties) {
    return res.status(403).json({
      error: "Property limit reached. Upgrade your plan.",
    });
  }

  next();
};

