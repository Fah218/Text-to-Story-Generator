require("dotenv").config();

const express = require("express");
const cors = require("cors");

const storyRoutes = require("./routes/storyRoutes");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");

const app = express();

// Allow all origins (needed for Railway + Vercel cross-origin requests)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});