const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const householdRoutes = require("./routes/householdRoutes");
const app = express();

// Middleware

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/households", householdRoutes);

// Test Route

app.get("/", (req, res) => {
  res.send("Hishabio Backend is running!");
});
// Server Connection

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
