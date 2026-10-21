// require express
const express = require("express");
const app = express();

// require cors/ middlewares
const cors = require("cors");

// Middlewar
app.use(
  cors({
    origin: "https://localhost:5173",
  }),
);

app.use(express.json());

// Test endpoint
app.get("/", (req, res) => {
  res.send("this that root route!");
  // res.status(200).json({
  //   success: true,
  //   message: "BAASA API is runnin",
  // });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BASSA API is running on PORT ${PORT}`);
});
