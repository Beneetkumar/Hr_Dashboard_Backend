import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// CORS config
const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? "https://hr-dashboard-frontend-ivory.vercel.app"
    : "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true, // ✅ allow cookies
  })
);

app.options("*", cors({ origin: allowedOrigin, credentials: true }));

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("✅ Backend running"));

const PORT = process.env.PORT || 5000;

connectDB().then(() =>
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
);
