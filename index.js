import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import salesRoutes from "./src/routes/sales.routes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create App
const app = express();
app.use(express.json());
app.use(cors());

await connectDB();

try {
  app.listen(PORT, () => {
    console.log(`🖥️  Server successfully connected at port ${PORT}`);
  });
} catch (error) {
  console.error("❌ Failed to start server:", error);
}

// Middleware for routes
app.use("/sales", salesRoutes);
