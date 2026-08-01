const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

require("dotenv").config();

console.log("ELEVENLABS_API_KEY:", process.env.ELEVENLABS_API_KEY ? "Loaded ✅" : "Missing ❌");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Loaded ✅" : "Missing ❌");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded ✅" : "Missing ❌");

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

app.post("/speak", async (req, res) => {
  try {
   const { text, voiceId } = req.body;

   console.log("Using Voice:", voiceId);

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
        }),
      }
    );

    if (!response.ok) {
  const error = await response.text();

  console.log("==================================");
  console.log("ElevenLabs Status:", response.status);
  console.log("ElevenLabs Error:", error);
  console.log("==================================");

  return res.status(response.status).json({ error });
}

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audioBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Speech generation failed",
    });
  }
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

    let candidateName = "Candidate";

const lines = resumeText
  .split("\n")
  .map(line => line.trim())
  .filter(Boolean);

if (lines.length > 0) {
  candidateName = lines[0];
}

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
  candidateName,
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
    const {
  role,
  difficulty,
  resumeText,
  candidateName,
  questionNumber,
} = req.body;

const prompt = `
You are a professional HR and Technical Interviewer.

Candidate Name:
${candidateName || "Candidate"}

Job Role:
${role}

Difficulty:
${difficulty}

Resume:
${resumeText || "No Resume Uploaded"}

Current Interview Question Number:
${questionNumber}

Interview Rules:

Question 1:
Greet the candidate by name and ask:
"Tell me about yourself."

Question 2:
Ask:
"Please walk me through your resume."

Question 3:
Ask:
"Why are you interested in the ${role} role?"

Question 4:
Ask about the candidate's strengths.

Question 5:
Ask about one weakness and how they are improving it.

Question 6 onwards:

If resume exists:
- Ask about projects.
- Ask about internships.
- Ask about certifications.
- Ask about skills.
- Ask follow-up questions from resume.

After resume questions:
Ask technical questions according to ${role} and ${difficulty}.

Rules:

- Ask ONLY ONE question.
- Never generate multiple questions.
- Never repeat previous questions.
- Keep questions conversational.
- Return ONLY the interviewer's question.
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
// Get Interview History
// =========================
app.get("/history", async (req, res) => {
  try {
    const history = await Interview.find().sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    console.error(error);

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
    console.error(error);

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
    console.error(error);

    res.status(500).json({
      error: "Failed to clear history",
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