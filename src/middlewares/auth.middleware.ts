import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Plan, Role } from "../modules/auth/auth.types";

const JWT_SECRET = process.env.JWT_SECRET;

interface JwtPayload {
  userId: string;
  role: Role;
  plan: Plan;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT_SECRET is not configured" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

