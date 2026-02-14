
import { Request, Response } from "express";
import { createProperty, getMyProperties } from "./listings.service";
import { createPropertySchema } from "./listings.validator";
import { trackEvent } from "../analytics/analytics.service";

export const createListing = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const data = createPropertySchema.parse(req.body);

    const property = await createProperty(user.userId, data);

    res.status(201).json(property);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const myListings = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const listings = await getMyProperties(user.userId);

  res.json(listings);
};

