const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  resumeText: String,
  skills: String,
  suggestedRole: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", ResumeSchema);