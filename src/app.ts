import express from "express";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.route";
import listingsRoutes from "./modules/listings/listings.route"

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
export default app;
 
