
import { Request, Response } from "express";
import { createFeaturedLink, getFeaturedProperties } from "./featured.service";

export const createLink = async (req: Request, res: Response) => {
  const user = req.user!;
  const { propertyIds } = req.body;

  try {
    const link = await createFeaturedLink(user.userId, propertyIds);
    res.json(link);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const viewFeatured = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const properties = await getFeaturedProperties(token);
    res.json(properties);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};
