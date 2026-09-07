require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const locationRoutes = require("./routes/locations");
const postRoutes = require("./routes/posts");
const aiRoutes = require("./routes/ai");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "gbp-post-manager-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required.");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required.");

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected.");

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error("Startup failed:", err.message);
  process.exit(1);
});

