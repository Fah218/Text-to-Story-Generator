require("dotenv").config();

const express = require("express");
const cors = require("cors");

const storyRoutes = require("./routes/storyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/story", storyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});