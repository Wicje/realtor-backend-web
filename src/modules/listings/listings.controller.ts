import { Request, Response } from "express";
import { createProperty, getMyProperties } from "./listings.service";

export const createListing = (req: Request, res: Response) => {
  const user = (req as any).user;

  const { title, description, price } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const property = createProperty(user.userId, {
    title,
    description,
    price,
  });

  res.status(201).json(property);
};

export const myListings = (req: Request, res: Response) => {
  const user = (req as any).user;
  const listings = getMyProperties(user.userId);

  res.json(listings);
};

