const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  isRunning: Boolean,
  totalPosts: Number,
  totalComments: Number,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});
