import express from "express";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.route";
import listingsRoutes from "./modules/listings/listings.route"
import leadRoutes from "./modules/leads/leads.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import otpRoutes from "./modules/otp/otp.routes";
import messageRoutes from "./modules/message/message.route";
import propertyRoutes from "./modules/property/property.routes";
import featuredRoutes from "./modules/featured/featured.routes";
import publicRoutes from "./modules/public/public.routes";

// Load environment variables
dotenv.config();

const app = express();

/**
 * Core middlewares
 * These run on EVERY request
 */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/**
 * Health check
 * Lets you know the server is alive
 */
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// Mount auth routes
app.use("/auth", authRoutes);
app.use("/listings", listingsRoutes);
app.use("/leads", leadRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/otp", otpRoutes);
app.use("/message", messageRoutes);
app.use("/property", propertyRoutes);
app.use("featured", featuredRoutes);
app.use("public", publicRoutes);

export default app;
 
