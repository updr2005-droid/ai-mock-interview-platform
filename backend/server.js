const express = require("express");
const cors = require("cors");
const ollama = require("ollama").default;
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const app = express();

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

    const resumeText = pdfData.text.substring(0, 3000);

    const aiResponse = await ollama.generate({
      model: "llama3.2:1b",
      prompt: `
Extract technical skills from this resume.

Resume:
${resumeText}

Rules:
- Return ONLY a comma separated list.
- No introduction.
- No explanation.
- No numbering.
- Maximum 10 skills.
`,
      stream: false,
    });

    res.json({
      skills: aiResponse.response.trim(),
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
    const { role, difficulty, skills } = req.body;

    const response = await ollama.generate({
      model: "llama3.2:1b",
      prompt: `
Generate ONE ${difficulty} level technical interview question.

Role:
${role}

Candidate Skills:
${skills || "Not Available"}

Rules:
- Ask only technical questions.
- Prefer skills if available.
- Return only the question.
- Maximum 25 words.
`,
      stream: false,
    });

    res.json({
      question: response.response.trim(),
    });
  } catch (error) {
    console.error("Question Error:", error);

    res.status(500).json({
      error: "Question generation failed",
    });
  }
});

// =========================
// Evaluate Answer
// =========================
app.post("/evaluate", async (req, res) => {
  try {
    const { question, answer } = req.body;

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

Respond ONLY with:

RELEVANT

or

NOT_RELEVANT
`,
      stream: false,
    });

    const relevance = relevanceCheck.response.trim();

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

    res.json({
      feedback: evaluation.response.trim(),
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
app.listen(5000, () => {
  console.log("Server running on port 5000");
});