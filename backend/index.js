require("dotenv").config();

const express = require("express");
const cors = require("cors");

const storyRoutes = require("./routes/storyRoutes");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");

const app = express();

// Handle CORS preflight for all routes (must come before any other middleware)
app.options("*", (req, res) => {
  res.set({
    "Access-Control-Allow-Origin": req.headers.origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  });
  res.status(200).end();
});

// Allow all origins (needed for Railway + Vercel cross-origin requests)
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

// Health check route — Railway uses this to confirm service is running
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "StoryStudio backend is live 🚀" });
});

app.use("/api/story", storyRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 20000,
})
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch((error) => console.error('❌ Database Connection Error: ', error.message));


const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Serverless Functions (Vercel/Netlify)
module.exports = app;