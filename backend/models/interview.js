const mongoose = require("mongoose");

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
    candidateName: {
  type: String,
  default: "",
},

interviewer: {
  type: String,
  default: "",
},

skills: {
  type: String,
  default: "",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);