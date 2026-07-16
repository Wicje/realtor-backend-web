import { Request, Response } from "express";
import {
  togglePropertyVisibility,
  allowClientAccess,
  removeClientAccess,
} from "./property.visibility.service";

export const toggleVisibility = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { isPublic } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const property = await togglePropertyVisibility(id, user.userId, Boolean(isPublic));
    return res.json(property);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return res.status(400).json({ error: message });
  }
};

export const allowAccess = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { phone } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await allowClientAccess(id, user.userId, phone);
    return res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return res.status(400).json({ error: message });
  }
};

export const removeAccess = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const { phone } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await removeClientAccess(id, user.userId, phone);
    return res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return res.status(400).json({ error: message });
  }
};
