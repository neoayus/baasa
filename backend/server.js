require("dotenv").config();

// require express
const express = require("express");
const app = express();

// require cors/ middlewares
const cors = require("cors");

// require mongoose
const mongoose = require("mongoose");

// Middlewear
app.use(
  cors({
    origin: "https://localhost:5173",
  }),
);

app.use(express.json());

// routes

// Test endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BAASA API is runnin",
  });
  console.log("this that root route!");
});

// define port
const PORT = process.env.PORT || 5000;

// Start Server after connection to mongoDB
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to mongoDb");

    app.listen(PORT, () => {
      console.log(`BASSA API is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start BAASA: ", error.message);
    process.exit(1);
  }
}

startServer();
