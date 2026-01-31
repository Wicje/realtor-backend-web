import express from "express";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.route";
import listingsRoutes from "./modules/listings/listings.route"

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.get("/ping", (req, res) => {
  console.log("Ping route hit");
  res.send("pong");
});

// Mount auth routes
app.use("/auth", authRoutes);
app.use("/listings", listingsRoutes);

export default app;
 
