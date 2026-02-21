require("dotenv").config();

const express = require("express");
const cors = require("cors");

const storyRoutes = require("./routes/storyRoutes");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/story", storyRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 8000, // Fail fast if Atlas can't be reached in 8s
  socketTimeoutMS: 20000,         // Drop socket if it's idle for 20s
})
  .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
  .catch((error) => console.error('❌ Database Connection Error: ', error.message));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});