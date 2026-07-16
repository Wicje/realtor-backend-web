import express from "express";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.route";
import listingsRoutes from "./modules/listings/listings.route";
import leadRoutes from "./modules/leads/leads.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import otpRoutes from "./modules/otp/otp.routes";
import messageRoutes from "./modules/message/message.route";
import propertyRoutes from "./modules/property/property.routes";
import featuredRoutes from "./modules/featured/featured.routes";
import publicRoutes from "./modules/public/public.routes";
import { reportErrorToSentry } from "./config/sentry";
import { rateLimitByIp, securityHeaders } from "./middlewares/security.middleware";
import realtimeRoutes from "./modules/realtime/realtime.route";
import { isDatabaseConfigured } from "./config/db";

dotenv.config();

const app = express();

app.use((req, res, next) => {
  const origin = process.env.CORS_ORIGIN;
  if (!origin) {
    throw new Error("CORS_ORIGIN environment variable is required. Set it to your frontend URL.");
  }
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(securityHeaders);
app.use(rateLimitByIp(300, 60_000));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => {
  if (!isDatabaseConfigured) {
    return res.status(503).json({
      status: "degraded",
      database: "missing",
    });
  }
  res.json({ status: "ok", database: "configured" });
});

app.use("/auth", authRoutes);
app.use("/listings", listingsRoutes);
app.use("/leads", leadRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/otp", otpRoutes);
app.use("/message", messageRoutes);
app.use("/property", propertyRoutes);
app.use("/featured", featuredRoutes);
app.use("/public", publicRoutes);
app.use("/realtime", realtimeRoutes);

app.use(async (err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  await reportErrorToSentry(err, {
    path: req.path,
    method: req.method,
  });

  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ error: message });
});

export default app;
