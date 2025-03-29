const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
