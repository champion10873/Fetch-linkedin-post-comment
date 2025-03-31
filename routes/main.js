const express = require("express");
const router = express.Router();
const mainController = require("../controllers/main");

// Start
router.post("/start", mainController.start);

// Get data
router.post("/get-data", mainController.getData);

module.exports = router;
