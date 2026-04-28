import { Request, Response } from "express";
import { createProperty, getMyProperties } from "./listings.service";
import { createPropertySchema } from "./listings.validator";

export const createListing = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = createPropertySchema.parse(req.body);

    const property = await createProperty(user.userId, data);

    return res.status(201).json(property);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return res.status(400).json({ error: message });
  }
};

export const myListings = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const listings = await getMyProperties(user.userId);

  return res.json(listings);
};
