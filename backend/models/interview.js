import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
    resumeName: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Interview", interviewSchema);

const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    role: String,
    difficulty: String,
    question: String,
    answer: String,
    score: Number,
    feedback: String,
    resumeName: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);