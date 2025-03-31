const express = require("express");
const router = express.Router();
const mainController = require("../controllers/main");

// Start
router.post("/start", mainController.start);

// Get data
router.get("/get-posts", mainController.getPosts);
router.get("/get-comments", mainController.getComments);

module.exports = router;
