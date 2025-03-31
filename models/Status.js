const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  isRunning: { type: Boolean, default: false },
  totalProfiles: Number,
  currentIndex: Number,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Status = mongoose.model("status", StatusSchema);
