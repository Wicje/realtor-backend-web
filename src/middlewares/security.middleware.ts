import { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetAt: number };

const ipBuckets = new Map<string, Bucket>();

const now = () => Date.now();

export const securityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("Referrer-Policy", "no-referrer");
  res.header("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
};

export const rateLimitByIp = (maxRequests: number, windowMs: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `${ip}:${req.baseUrl || ""}:${req.path}`;
    const bucket = ipBuckets.get(key);

    if (!bucket || now() > bucket.resetAt) {
      ipBuckets.set(key, { count: 1, resetAt: now() + windowMs });
      return next();
    }

    if (bucket.count >= maxRequests) {
      return res.status(429).json({ error: "Too many requests. Please retry later." });
    }

    bucket.count += 1;
    return next();
  };
};
