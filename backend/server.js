const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const ollama = require("ollama").default;
const Resume = require("./models/Resume");
const Interview = require("./models/Interview");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();

console.log(
  "All env keys:",
  Object.keys(process.env).filter(k => k.includes("MONGO"))
);

connectDB();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// =========================
// Resume Upload
// =========================
app.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    console.log("Resume uploaded...");

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    
    console.log("===== RESUME TEXT =====");
    console.log(pdfData.text);
    console.log("=======================");


    const resumeText = pdfData.text.substring(0, 3000);

// Extract skills directly from resume text
const skillsMatch = resumeText.match(
  /TECHNICAL SKILLS:([\s\S]*?)KEY COMPETENCIES:/i
);

let skills = "";

if (skillsMatch) {
  skills = skillsMatch[1]
    .replace(/Programming:/gi, "")
    .replace(/Database:/gi, "")
    .replace(/Web:/gi, "")
    .replace(/Data Tools:/gi, "")
    .replace(/\./g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Fallback if section not found
if (!skills) {
  skills = "No skills detected";
}

const suggestedRole = "Data Analyst";

const resume = await Resume.create({
  resumeText,
  skills,
  suggestedRole,
});

fs.unlinkSync(req.file.path);

res.json({
  resumeId: resume._id,
  skills,
  suggestedRole,
  resumeText,
});
  } catch (error) {
    console.error("Resume Error:", error);

    res.status(500).json({
      error: "Resume processing failed",
    });
  }
});

// =========================
// Generate Question
// =========================
app.post("/question", async (req, res) => {
  try {
    const { role, difficulty, resumeText } = req.body;

    const prompt = `
You are an experienced technical interviewer.

Candidate Resume:
${resumeText || "No resume uploaded."}

Job Role: ${role}
Difficulty: ${difficulty}

Instructions:
- Generate ONLY ONE interview question.
- If resume is available, ask ONLY from the resume.
- Prefer questions about projects, skills, education, internships, certifications.
- Do NOT ask anything not mentioned in the resume.
- If no resume is available, ask one ${difficulty} level ${role} interview question.
- Return ONLY the question.
`;

    const response = await ollama.chat({
      model: "llama3.2:3b",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      question: response.message.content.trim(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to generate question",
    });
  }
});

// =========================
// Evaluate Answer
// =========================
app.post("/evaluate", async (req, res) => {
  try {
   const {
  question,
  answer,
  role,
  difficulty,
  resumeName,
} = req.body;
    // =========================
// Early Rejection Checks
// =========================
const cleanedAnswer = answer.trim().toLowerCase();

// Too short
if (cleanedAnswer.split(/\s+/).length < 3) {
  return res.json({
    feedback: `
Score: 0/10

Strengths:
- Attempted a response.

Improvements:
- Answer is too short to evaluate.
- Provide a meaningful explanation.
`
  });
}

// =========================
// Get Interview History
// =========================
app.get("/history", async (req, res) => {
  try {
    const history = await Interview.find().sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch history",
    });
  }
});

// =========================
// Delete One Interview
// =========================
app.delete("/history/:id", async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);

    res.json({
      message: "Interview deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: "Delete failed",
    });
  }
});

// =========================
// Clear History
// =========================
app.delete("/history", async (req, res) => {
  try {
    await Interview.deleteMany({});

    res.json({
      message: "History cleared",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed",
    });
  }
});
// Common nonsense answers
const bannedPhrases = [
  "i am a banana",
  "banana",
  "asdf",
  "asdf asdf",
  "asdf asdf asdf",
  "qwerty",
  "random text",
  "hello world",
  "test",
  "nothing",
  "idk",
  "i dont know",
  "i don't know"
];

if (bannedPhrases.includes(cleanedAnswer)) {
  return res.json({
    feedback: `
Score: 0/10

Strengths:
- Attempted a response.

Improvements:
- The answer is not relevant to the question.
- Avoid random, placeholder, or nonsensical text.
`
  });
}

    if (!answer || answer.trim().length < 5) {
      return res.json({
        feedback: `
Score: 0/10

Strengths:
- No meaningful answer provided.

Improvements:
- Provide a complete and relevant answer.
`
      });
    }

    // STEP 1: Relevance Check
    const relevanceCheck = await ollama.generate({
      model: "llama3.2:3b",
      prompt: `
You are a strict relevance checker.

Question:
${question}

Answer:
${answer}

Rules:
- Random text = NOT_RELEVANT
- Gibberish = NOT_RELEVANT
- Unrelated answer = NOT_RELEVANT
- Partial attempt = RELEVANT

Respond with ONLY one word.

RELEVANT

or

NOT_RELEVANT

Examples:

Question: What is React?
Answer: I am a banana
NOT_RELEVANT

Question: What is React?
Answer: React is a JavaScript library used to build user interfaces.
RELEVANT

Question: Explain closures in JavaScript.
Answer: The weather is nice today.
NOT_RELEVANT
`,
      stream: false,
    });

    const relevance = relevanceCheck.response.trim();

console.log("QUESTION:", question);
console.log("ANSWER:", answer);
console.log("RELEVANCE:", relevance);

if (relevance.includes("NOT_RELEVANT")) {
  return res.json({
    feedback: `
Score: 0/10

Strengths:
- Attempted a response.

Improvements:
- The answer is not related to the question.
- Focus on answering the technical concept being asked.
- Avoid random or unrelated text.
`
  });
}
    // STEP 2: Actual Evaluation
    const evaluation = await ollama.generate({
      model: "llama3.2:3b",
      prompt: `
You are a strict technical interviewer.

Question:
${question}

Candidate Answer:
${answer}
Instructions:

- Evaluate ONLY the answer provided.
- Do NOT assume information that is not written.
- Do NOT invent missing details.
- Penalize vague answers.
- Penalize incomplete answers.
- If the answer is partially correct, reduce the score.

Scoring Rules:

- 0-1 = Irrelevant, nonsense, random text, gibberish, or completely incorrect answer.
- 2-3 = Related but mostly incorrect answer.
- 4-5 = Basic understanding with significant gaps.
- 6-7 = Correct answer covering the main concepts.
- 8-9 = Strong answer with good details, examples, or code.
- 10 = Exceptional, comprehensive, and highly accurate answer.

IMPORTANT:

- Never give credit for information that is not explicitly written in the candidate's answer.
- Never assume the candidate knows a concept unless it is directly stated.
- Strengths must be based only on statements present in the answer.
- Do not invent examples, explanations, or concepts that the candidate did not mention.
- If a point is missing, mention it as an improvement instead of assuming it was implied.
- Only evaluate statements actually written by the candidate.
- Do not infer or add missing concepts.

For coding questions:

- Evaluate only against the requirements of the question.
- Do not deduct marks for missing features that were not explicitly requested.
- Do not require error handling, input validation, optimization, edge-case handling, or advanced features unless the question specifically asks for them.
- Judge correctness first.
- Judge whether the code answers the question.
- Small working examples are acceptable when the question asks only for an example.

For theory questions:

- Reward technically correct explanations even if they are brief.
- Do NOT give 0/10 to answers that are related to the question.
- A correct answer covering the main concept should receive at least 6-8 marks.
- Use 9-10 only for detailed, highly accurate, and comprehensive answers.


Return EXACTLY:

Score: X/10

Strengths:
- Point 1
- Point 2

Improvements:
- Point 1
- Point 2
`,
      stream: false,
    });

    const feedback = evaluation.response.trim();

let score = 0;

const match = feedback.match(/Score:\s*(\d+)\/10/i);

if (match) {
  score = parseInt(match[1]);
}

await Interview.create({
  role,
  difficulty,
  question,
  answer,
  score,
  feedback,
  resumeName,
});

    res.json({
  feedback,
});

  } catch (error) {
    console.error("Evaluation Error:", error);

    res.status(500).json({
      error: "Evaluation failed",
    });
  }
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});