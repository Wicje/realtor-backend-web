import { Request, Response, NextFunction } from "express";
import { getPropertyById } from "../modules/listings/listings.service";

export const requirePropertyOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const propertyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!user || !propertyId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const property = await getPropertyById(propertyId);

  if (!property) {
    return res.status(404).json({ error: "Property not found" });
  }

  if (property.realtorId !== user.userId) {
    return res.status(403).json({ error: "Not your property" });
  }

  return next();
};
