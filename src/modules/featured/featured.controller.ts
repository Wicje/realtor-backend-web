import { Request, Response } from "express";
import { createFeaturedLink, getFeaturedProperties } from "./featured.service";

export const createLink = async (req: Request, res: Response) => {
  const user = req.user;
  const { propertyIds } = req.body;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const link = await createFeaturedLink(user.userId, propertyIds);
    return res.json(link);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return res.status(400).json({ error: message });
  }
};

export const viewFeatured = async (req: Request, res: Response) => {
  const token = Array.isArray(req.params.token) ? req.params.token[0] : req.params.token;

  try {
    const properties = await getFeaturedProperties(token);
    return res.json(properties);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Featured link not found";
    return res.status(404).json({ error: message });
  }
};
