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

dotenv.config();

const app = express();

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN ?? "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
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

app.use(async (err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  await reportErrorToSentry(err, {
    path: req.path,
    method: req.method,
  });

  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ error: message });
});

export default app;
