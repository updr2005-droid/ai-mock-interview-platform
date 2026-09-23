// =====================================================
// DNS
// =====================================================

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

// =====================================================
// ENV
// =====================================================

require("dotenv").config();

console.log(
  "ELEVENLABS_API_KEY:",
  process.env.ELEVENLABS_API_KEY
    ? "Loaded ✅"
    : "Missing ❌"
);

console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI
    ? "Loaded ✅"
    : "Missing ❌"
);

console.log(
  "JWT_SECRET:",
  process.env.JWT_SECRET
    ? "Loaded ✅"
    : "Missing ❌"
);

// =====================================================
// IMPORTS
// =====================================================

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const connectDB = require("./config/db");

const ollamaPackage = require("ollama");
const ollama = ollamaPackage.default || ollamaPackage;

const Resume = require("./models/Resume");
const Interview = require("./models/Interview");

const pdfParse = require("pdf-parse");

// =====================================================
// APP
// =====================================================

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// UPLOAD
// =====================================================

const upload = multer({
  dest: "uploads/",
});

// Make sure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "AI Mock Interview Backend is running 🚀",
  });
});

// =====================================================
// INTERVIEWER VOICES
// =====================================================

const interviewerVoices = {
  maya: process.env.MAYA_VOICE_ID,
  ethan: process.env.ETHAN_VOICE_ID,
  sophia: process.env.SOPHIA_VOICE_ID,
  james: process.env.JAMES_VOICE_ID,
};

// =====================================================
// GET NORMALIZED INTERVIEWER
// =====================================================

function normalizeInterviewer(interviewer) {
  if (!interviewer) {
    return "maya";
  }

  const value = String(interviewer)
    .trim()
    .toLowerCase();

  if (value.includes("maya")) {
    return "maya";
  }

  if (value.includes("ethan")) {
    return "ethan";
  }

  if (value.includes("sophia")) {
    return "sophia";
  }

  if (value.includes("james")) {
    return "james";
  }

  return "maya";
}

// =====================================================
// TEXT TO SPEECH - ELEVENLABS
// =====================================================

app.post("/speak", async (req, res) => {
  try {
    const {
      text,
      interviewer,
      voiceId: customVoiceId,
    } = req.body;

    console.log("\n==================================");
    console.log("🎤 TTS REQUEST");
    console.log("Interviewer:", interviewer);
    console.log("==================================");

    if (!text || !String(text).trim()) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({
        error: "ElevenLabs API key is missing",
      });
    }

    // -------------------------------------------------
    // Select Voice
    // -------------------------------------------------

    let voiceId = customVoiceId;

    if (!voiceId) {
      const interviewerKey =
        normalizeInterviewer(interviewer);

      voiceId =
        interviewerVoices[interviewerKey];

      console.log(
        "Normalized interviewer:",
        interviewerKey
      );
    }

    if (!voiceId) {
      return res.status(400).json({
        error:
          "Voice ID is not configured for this interviewer",
        interviewer,
      });
    }

    console.log("Selected Voice ID:", voiceId);

    // -------------------------------------------------
    // ElevenLabs API
    // -------------------------------------------------

    const elevenLabsUrl =
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await fetch(
      elevenLabsUrl,
      {
        method: "POST",

        headers: {
          "xi-api-key":
            process.env.ELEVENLABS_API_KEY,

          "Content-Type":
            "application/json",

          Accept: "audio/mpeg",
        },

        body: JSON.stringify({
          text: String(text).trim(),

          model_id:
            "eleven_multilingual_v2",

          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.2,
            use_speaker_boost: true,
          },
        }),
      }
    );

    // -------------------------------------------------
    // ElevenLabs Error
    // -------------------------------------------------

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "ElevenLabs Status:",
        response.status
      );

      console.error(
        "ElevenLabs Error:",
        errorText
      );

      return res.status(
        response.status
      ).json({
        error: errorText,
      });
    }

    // -------------------------------------------------
    // AUDIO
    // -------------------------------------------------

    const audioBuffer =
      Buffer.from(
        await response.arrayBuffer()
      );

    res.setHeader(
      "Content-Type",
      "audio/mpeg"
    );

    res.setHeader(
      "Content-Length",
      audioBuffer.length
    );

    return res.send(audioBuffer);

  } catch (error) {
    console.error(
      "Speech Error:",
      error
    );

    return res.status(500).json({
      error:
        "Speech generation failed",

      details:
        error.message,
    });
  }
});

// =====================================================
// RESUME UPLOAD
// =====================================================

app.post(
  "/upload-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      console.log("\n==================================");
      console.log("📄 RESUME UPLOAD");
      console.log("==================================");

      if (!req.file) {
        return res.status(400).json({
          error:
            "Resume file is required",
        });
      }

      const pdfBuffer =
        fs.readFileSync(
          req.file.path
        );

      const pdfData =
        await pdfParse(pdfBuffer);

      const resumeText =
        pdfData.text
          .substring(0, 8000)
          .trim();

      console.log(
        "Resume text length:",
        resumeText.length
      );

      // -------------------------------------------------
      // Candidate Name
      // -------------------------------------------------

      let candidateName =
        "Candidate";

      const lines =
        resumeText
          .split("\n")
          .map((line) =>
            line.trim()
          )
          .filter(Boolean);

      if (lines.length > 0) {
        candidateName =
          lines[0]
            .replace(
              /[^a-zA-Z .'-]/g,
              ""
            )
            .trim() ||
          "Candidate";
      }

      // -------------------------------------------------
      // Skills
      // -------------------------------------------------

      let skills = "";

      const skillsMatch =
        resumeText.match(
          /(?:technical skills|skills|key skills|technologies|technical expertise)\s*:?\s*([\s\S]*?)(?=\n\s*(?:projects|experience|education|certifications|achievements|internship|work experience)\b|$)/i
        );

      if (skillsMatch) {
        skills =
          skillsMatch[1]
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .trim();
      }

      if (!skills) {
        skills =
          "Skills could not be automatically detected";
      }

      // -------------------------------------------------
      // Suggested Role
      // -------------------------------------------------

      const suggestedRole =
        "Data Analyst";

      // -------------------------------------------------
      // Save Resume
      // -------------------------------------------------

      const resume =
        await Resume.create({
          resumeText,
          skills,
          suggestedRole,
        });

      // -------------------------------------------------
      // Delete Temporary File
      // -------------------------------------------------

      try {
        fs.unlinkSync(
          req.file.path
        );
      } catch (deleteError) {
        console.log(
          "Temporary file delete failed"
        );
      }

      return res.json({
        resumeId:
          resume._id,

        candidateName,

        skills,

        suggestedRole,

        resumeText,
      });

    } catch (error) {
      console.error(
        "Resume Error:",
        error
      );

      return res.status(500).json({
        error:
          "Resume processing failed",

        details:
          error.message,
      });
    }
  }
);

// =====================================================
// BUILD PREVIOUS HISTORY
// =====================================================

function buildPreviousHistory(
  previousQuestions = [],
  previousAnswers = []
) {
  const history = [];

  // -------------------------------------------------
  // New frontend format:
  // previousAnswers = [
  //   {
  //      question,
  //      answer,
  //      score,
  //      feedback
  //   }
  // ]
  // -------------------------------------------------

  if (
    Array.isArray(previousAnswers) &&
    previousAnswers.length > 0
  ) {
    previousAnswers.forEach(
      (item, index) => {
        if (
          item &&
          typeof item === "object"
        ) {
          history.push({
            number:
              item.questionNumber ||
              index + 1,

            question:
              item.question || "",

            answer:
              item.answer || "",
          });
        } else {
          history.push({
            number: index + 1,

            question:
              Array.isArray(
                previousQuestions
              )
                ? previousQuestions[index] ||
                  ""
                : "",

            answer:
              String(item || ""),
          });
        }
      }
    );
  }

  // -------------------------------------------------
  // Old frontend format
  // -------------------------------------------------

  if (
    history.length === 0 &&
    Array.isArray(previousQuestions) &&
    previousQuestions.length > 0
  ) {
    previousQuestions.forEach(
      (question, index) => {
        history.push({
          number: index + 1,

          question:
            String(question || ""),

          answer:
            Array.isArray(
              previousAnswers
            )
              ? String(
                  previousAnswers[index] ||
                    ""
                )
              : "",
        });
      }
    );
  }

  if (history.length === 0) {
    return "No previous questions or answers.";
  }

  return history
    .map(
      (item) =>
        `Question ${item.number}:
${item.question}

Candidate Answer:
${item.answer}`
    )
    .join(
      "\n\n-------------------------\n\n"
    );
}

// =====================================================
// GENERATE INTERVIEW QUESTION
// =====================================================

app.post(
  "/question",
  async (req, res) => {
    try {
      const {
        role,
        difficulty,
        resumeText,
        candidateName,
        questionNumber,
        previousQuestions = [],
        previousAnswers = [],
        totalQuestions = 5,
      } = req.body;

      const currentQuestionNumber =
        Number(questionNumber) || 1;

      console.log("\n==================================");
      console.log(
        `🧠 GENERATING QUESTION ${currentQuestionNumber}`
      );
      console.log("Role:", role);
      console.log(
        "Difficulty:",
        difficulty
      );
      console.log(
        "Previous answers:",
        Array.isArray(
          previousAnswers
        )
          ? previousAnswers.length
          : 0
      );
      console.log("==================================");

      const previousHistory =
        buildPreviousHistory(
          previousQuestions,
          previousAnswers
        );

      // =================================================
      // INTERVIEW FLOW
      // =================================================

      let flowInstructions = "";

      // =================================================
      // QUESTION 1
      // =================================================

      if (
        currentQuestionNumber === 1
      ) {
        flowInstructions = `
This is the FIRST question of the interview.

Start with a short natural greeting using the candidate's name.

Then ask the candidate to introduce themselves.

The main purpose of this question is:
- Candidate introduction
- Background
- Education
- General professional interests

The question must essentially be:
"Tell me about yourself."

Do not ask about technical skills yet.
Do not ask about projects yet.
`;
      }

      // =================================================
      // QUESTION 2
      // =================================================

      else if (
        currentQuestionNumber === 2
      ) {
        const firstAnswer =
          Array.isArray(
            previousAnswers
          ) &&
          previousAnswers[0]
            ? typeof previousAnswers[0] ===
              "object"
              ? previousAnswers[0].answer
              : previousAnswers[0]
            : "";

        flowInstructions = `
This is QUESTION 2.

The candidate's answer to Question 1 was:

"${firstAnswer}"

Create ONE natural follow-up question.

The question MUST connect:
1. The candidate's previous answer.
2. The selected job role.

Selected Job Role:
${role}

Possible directions:
- Why are you interested in this role?
- How does your background prepare you for this role?
- You mentioned something interesting in your introduction. How does it relate to this role?
- What motivated you to choose this career path?

Do NOT ask "Tell me about yourself" again.

Do NOT ask a generic unrelated question.

The question must feel like a real interviewer is continuing the conversation.
`;
      }

      // =================================================
      // QUESTION 3
      // =================================================

      else if (
        currentQuestionNumber === 3
      ) {
        flowInstructions = `
This is QUESTION 3.

Now move into the candidate's resume.

Ask ONE question about:
- Resume background
- Education
- Career journey
- Internship
- Training
- Experience

Resume:
${resumeText}

The question must be based on information actually found in the resume.

Do NOT ask:
"Tell me about yourself."

Do NOT repeat Question 2.

Do not invent any experience.
`;
      }

      // =================================================
      // QUESTION 4
      // =================================================

      else if (
        currentQuestionNumber === 4
      ) {
        flowInstructions = `
This is QUESTION 4.

Ask ONE specific question about a skill, technology, tool, certification, or achievement found in the resume.

Resume:
${resumeText}

Choose ONE real item from the resume.

For example, if the resume contains Power BI:
"Could you explain a dashboard you created using Power BI and what insights you presented?"

If the resume contains SQL:
"Can you describe a situation where you used SQL to analyze data?"

Only use something actually present in the resume.

Do NOT invent skills.

Do NOT repeat topics already discussed.
`;
      }

      // =================================================
      // QUESTION 5
      // =================================================

      else if (
        currentQuestionNumber === 5
      ) {
        flowInstructions = `
This is QUESTION 5.

Ask ONE specific question about a project found in the resume.

Resume:
${resumeText}

Choose ONE actual project.

Ask about one of:
- Candidate's contribution
- Technology used
- Implementation
- Challenge
- Solution
- Result
- Learning

Do NOT ask:
"Tell me about your projects."

Instead, ask about ONE specific project.

Do NOT invent a project.

Do NOT repeat Question 4.
`;
      }

      // =================================================
      // QUESTION 6+
      // =================================================

      else {
        flowInstructions = `
This is QUESTION ${currentQuestionNumber}.

The interview already contains previous questions and answers.

Review them carefully:

${previousHistory}

Now ask ONE new professional interview question related to:

Job Role:
${role}

Difficulty:
${difficulty}

Resume:
${resumeText}

You may ask about:
- Technical knowledge
- Problem solving
- Scenario based situations
- Role-specific knowledge
- Resume details
- Projects
- Skills
- Behavioral situations
- Workplace situations

IMPORTANT:
Do not repeat any previous question.

Choose a topic that has not already been covered.

If a previous answer contains an interesting detail,
you may ask a deeper follow-up.
`;
      }

      // =================================================
      // FINAL PROMPT
      // =================================================

      const prompt = `
You are a professional AI interviewer.

Candidate:
${candidateName || "Candidate"}

Job Role:
${role || "General"}

Difficulty:
${difficulty || "Medium"}

Resume:
${resumeText || "No resume available"}

Current Question:
${currentQuestionNumber}

Total Questions:
${totalQuestions}

====================================================
CURRENT INTERVIEW INSTRUCTION
====================================================

${flowInstructions}

====================================================
PREVIOUS INTERVIEW HISTORY
====================================================

${previousHistory}

====================================================
STRICT RULES
====================================================

1. Ask ONLY ONE question.

2. Never ask multiple questions.

3. Never repeat a previous question.

4. Read all previous questions and answers before creating a new question.

5. If creating a follow-up question, use information actually provided by the candidate.

6. Resume questions must use information actually found in the resume.

7. Never invent projects.

8. Never invent skills.

9. Never invent companies.

10. Never invent certifications.

11. Never invent internships.

12. Question 1 must focus on introduction.

13. Question 2 must connect the introduction with the job role.

14. Question 3 must move into resume/background.

15. Question 4 must focus on a specific resume skill/tool/achievement.

16. Question 5 must focus on a specific resume project.

17. Keep questions conversational.

18. Match the selected job role.

19. Match the difficulty level.

20. Return ONLY the question.

21. Do not write:
Question:
Interviewer:
Candidate:
Answer:

22. Do not provide explanations.

23. Do not provide answer options.

24. Do not answer the question yourself.

25. Do not repeat "Tell me about yourself" after Question 1.

====================================================

Generate ONE interview question now.
`;

      // =================================================
      // OLLAMA
      // =================================================

      const response =
        await ollama.chat({
          model: "llama3.2:3b",

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],

          options: {
            temperature: 0.75,
          },
        });

      let generatedQuestion =
        response?.message?.content
          ?.trim() || "";

      // =================================================
      // CLEAN QUESTION
      // =================================================

      generatedQuestion =
        generatedQuestion
          .replace(
            /^question\s*\d*\s*[:.-]\s*/i,
            ""
          )
          .replace(
            /^interviewer\s*[:.-]\s*/i,
            ""
          )
          .replace(
            /^q\s*\d*\s*[:.-]\s*/i,
            ""
          )
          .replace(/^["']|["']$/g, "")
          .trim();

      // =================================================
      // ONLY ONE QUESTION
      // =================================================

      const questionMarks =
        (
          generatedQuestion.match(/\?/g) ||
          []
        ).length;

      if (questionMarks > 1) {
        const firstQuestionEnd =
          generatedQuestion.indexOf(
            "?"
          );

        generatedQuestion =
          generatedQuestion.substring(
            0,
            firstQuestionEnd + 1
          );
      }

      // =================================================
      // FALLBACK
      // =================================================

      if (!generatedQuestion) {
        if (
          currentQuestionNumber === 1
        ) {
          generatedQuestion =
            `Hi ${candidateName || "there"}, could you tell me about yourself?`;
        } else if (
          currentQuestionNumber === 2
        ) {
          generatedQuestion =
            `Why are you interested in the ${role} role?`;
        } else {
          generatedQuestion =
            `Could you tell me about an experience from your resume that is relevant to this ${role} role?`;
        }
      }

      console.log(
        `QUESTION ${currentQuestionNumber}:`,
        generatedQuestion
      );

      return res.json({
        question:
          generatedQuestion,
      });

    } catch (error) {
      console.error(
        "Question Generation Error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to generate question",

        details:
          error.message,
      });
    }
  }
);

// =====================================================
// EVALUATE ANSWER
// =====================================================

app.post(
  "/evaluate",
  async (req, res) => {
    try {
      const {
        question,
        answer,
        role,
        difficulty,
        resumeName,
        resumeText,
      } = req.body;

      // =================================================
      // BASIC VALIDATION
      // =================================================

      if (
        !answer ||
        !String(answer).trim()
      ) {
        return res.json({
          score: 0,

          feedback: `
Score: 0/10

Strengths:

- No meaningful answer was provided.

Improvements:

- Provide a complete answer.
- Answer the question directly.
`,
        });
      }

      const cleanedAnswer =
        String(answer)
          .trim()
          .toLowerCase();

      // =================================================
      // TOO SHORT
      // =================================================

      if (
        cleanedAnswer.split(/\s+/)
          .length < 3
      ) {
        return res.json({
          score: 0,

          feedback: `
Score: 0/10

Strengths:

- A response was attempted.

Improvements:

- The answer is too short to evaluate.
- Provide a meaningful explanation related to the question.
`,
        });
      }

      // =================================================
      // NONSENSE DETECTION
      // =================================================

      const bannedPhrases = [
        "i am a banana",
        "i'm a banana",
        "banana",
        "asdf",
        "asdf asdf",
        "asdf asdf asdf",
        "qwerty",
        "qwertyuiop",
        "random text",
        "hello world",
        "test",
        "testing",
        "nothing",
        "idk",
        "i dont know",
        "i don't know",
        "blah blah",
        "blah",
      ];

      const normalized =
        cleanedAnswer
          .replace(/[.!?,]/g, "")
          .replace(/\s+/g, " ")
          .trim();

      if (
        bannedPhrases.includes(
          normalized
        )
      ) {
        return res.json({
          score: 0,

          feedback: `
Score: 0/10

Strengths:

- A response was attempted.

Improvements:

- The answer is not relevant to the interview question.
- Avoid random, placeholder, or nonsensical responses.
- Provide a clear answer related to the question.
`,
        });
      }

      // =================================================
      // RELEVANCE CHECK
      // =================================================

      const relevanceCheck =
        await ollama.generate({
          model: "llama3.2:3b",

          prompt: `
You are a VERY STRICT interview answer relevance checker.

Question:
${question}

Candidate Answer:
${answer}

Determine whether the candidate answer is meaningfully related to the question.

Rules:

- Random text = NOT_RELEVANT
- Gibberish = NOT_RELEVANT
- Completely unrelated answer = NOT_RELEVANT
- "I am a banana" = NOT_RELEVANT
- "The weather is nice" when asked about programming = NOT_RELEVANT
- A short but relevant answer = RELEVANT
- A partial but related answer = RELEVANT
- An incomplete but related answer = RELEVANT
- A simple correct answer = RELEVANT
- A weak but relevant answer = RELEVANT

Examples:

Question:
What is React?

Answer:
I am a banana.

NOT_RELEVANT

Question:
What is React?

Answer:
React is a JavaScript library used to build user interfaces.

RELEVANT

Question:
Explain SQL joins.

Answer:
I like playing cricket.

NOT_RELEVANT

Question:
Tell me about yourself.

Answer:
I am a BCA student interested in data analytics.

RELEVANT

Respond with ONLY:

RELEVANT

or

NOT_RELEVANT
`,

          stream: false,
        });

      const relevance =
        String(
          relevanceCheck?.response ||
            ""
        )
          .trim()
          .toUpperCase();

      console.log(
        "Question:",
        question
      );

      console.log(
        "Answer:",
        answer
      );

      console.log(
        "Relevance:",
        relevance
      );

      // =================================================
      // REJECT IRRELEVANT
      // =================================================

      if (
        relevance.includes(
          "NOT_RELEVANT"
        )
      ) {
        const feedback = `
Score: 0/10

Strengths:

- A response was attempted.

Improvements:

- The answer is not related to the question.
- Focus directly on the concept, situation, or experience being asked.
- Avoid unrelated or random responses.
`;

        // Save evaluation
        try {
          await Interview.create({
            role,
            difficulty,
            question,
            answer,
            score: 0,
            feedback,
            resumeName,
          });
        } catch (saveError) {
          console.error(
            "Interview save error:",
            saveError
          );
        }

        return res.json({
          score: 0,
          feedback,
        });
      }

      // =================================================
      // ACTUAL EVALUATION
      // =================================================

      const evaluation =
        await ollama.generate({
          model: "llama3.2:3b",

          prompt: `
You are a strict professional interviewer.

Job Role:
${role}

Difficulty:
${difficulty}

Question:
${question}

Candidate Answer:
${answer}

====================================================
SCORING
====================================================

0-1:
Irrelevant, nonsense, gibberish, random,
or completely incorrect answer.

2-3:
Related but mostly incorrect answer.

4-5:
Basic understanding with significant gaps.

6-7:
Correct answer covering the main concepts.

8-9:
Strong answer with good details, examples,
reasoning, or practical understanding.

10:
Exceptional, comprehensive and highly accurate answer.

====================================================
RULES
====================================================

1. Evaluate ONLY what the candidate actually wrote.

2. Do not assume missing information.

3. Do not invent candidate strengths.

4. Do not give credit for concepts not mentioned.

5. Penalize vague answers.

6. Penalize incomplete answers.

7. Do not give 0 to a relevant answer.

8. Do not give 10 unless the answer is exceptionally strong.

9. A short but technically correct answer can receive 6-8.

10. Missing important information should appear under Improvements.

====================================================
CODING QUESTIONS
====================================================

For coding questions:

- Judge correctness.
- Judge whether the code answers the question.
- Do not require error handling unless requested.
- Do not require optimization unless requested.
- Do not penalize edge cases unless relevant.

====================================================
THEORY QUESTIONS
====================================================

For theory:

- Reward technically correct explanations.
- Brief but correct answers can receive 6-8.
- Incorrect technical statements should reduce the score.
- Missing important concepts should reduce the score.

====================================================
OUTPUT
====================================================

Return EXACTLY:

Score: X/10

Strengths:

- Point 1
- Point 2

Improvements:

- Point 1
- Point 2

Do not return anything else.
`,

          stream: false,
        });

      let feedback =
        String(
          evaluation?.response || ""
        ).trim();

      // =================================================
      // SCORE EXTRACTION
      // =================================================

      let score = 0;

      const scoreMatch =
        feedback.match(
          /Score\s*:\s*(10|[0-9])\s*\/\s*10/i
        );

      if (scoreMatch) {
        score = parseInt(
          scoreMatch[1],
          10
        );
      }

      if (
        Number.isNaN(score)
      ) {
        score = 0;
      }

      score = Math.max(
        0,
        Math.min(10, score)
      );

      // =================================================
      // FALLBACK FEEDBACK
      // =================================================

      if (!feedback) {
        feedback = `
Score: ${score}/10

Strengths:

- The answer was relevant to the question.

Improvements:

- Provide more specific details and examples.
`;
      }

      // =================================================
      // SAVE INTERVIEW
      // =================================================

      try {
        await Interview.create({
          role,
          difficulty,
          question,
          answer,
          score,
          feedback,
          resumeName,
        });
      } catch (saveError) {
        console.error(
          "Interview Save Error:",
          saveError
        );
      }

      // =================================================
      // RESPONSE
      // =================================================

      return res.json({
        score,
        feedback,
      });

    } catch (error) {
      console.error(
        "Evaluation Error:",
        error
      );

      return res.status(500).json({
        error:
          "Evaluation failed",

        details:
          error.message,
      });
    }
  }
);

// =====================================================
// GET INTERVIEW HISTORY
// =====================================================

app.get(
  "/history",
  async (req, res) => {
    try {
      const history =
        await Interview.find()
          .sort({
            createdAt: -1,
          });

      return res.json(history);

    } catch (error) {
      console.error(
        "History Error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to fetch history",
      });
    }
  }
);

// =====================================================
// DELETE ONE INTERVIEW
// =====================================================

app.delete(
  "/history/:id",
  async (req, res) => {
    try {
      await Interview.findByIdAndDelete(
        req.params.id
      );

      return res.json({
        message:
          "Interview deleted successfully",
      });

    } catch (error) {
      console.error(
        "Delete Error:",
        error
      );

      return res.status(500).json({
        error:
          "Delete failed",
      });
    }
  }
);

// =====================================================
// CLEAR HISTORY
// =====================================================

app.delete(
  "/history",
  async (req, res) => {
    try {
      await Interview.deleteMany({});

      return res.json({
        message:
          "Interview history cleared successfully",
      });

    } catch (error) {
      console.error(
        "Clear History Error:",
        error
      );

      return res.status(500).json({
        error:
          "Failed to clear history",
      });
    }
  }
);

// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log("\n==================================");
    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );
    console.log(
      "🤖 Ollama model: llama3.2:3b"
    );
    console.log(
      "🎤 ElevenLabs TTS: Enabled"
    );
    console.log(
      "==================================\n"
    );
  }
);