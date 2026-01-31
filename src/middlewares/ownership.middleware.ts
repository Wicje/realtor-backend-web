import { Request, Response, NextFunction } from "express";
import { getPropertyById } from "../modules/listings/listings.service";

export const requirePropertyOwner = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const propertyId = req.params.id;

  const property = getPropertyById(propertyId);

  if (!property) {
    return res.status(404).json({ error: "Property not found" });
  }

  if (property.realtorId !== user.userId) {
    return res.status(403).json({ error: "Not your property" });
  }

  (req as any).property = property;
  next();
};

