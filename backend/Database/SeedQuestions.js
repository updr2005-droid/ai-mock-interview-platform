const ollama = require("ollama").default;
const db = require("./db");

const ROLE = "Software Engineer";
const DIFFICULTY = "Easy";
const CATEGORY = "General";

async function generateQuestions() {
  try {
    const prompt = `
Generate exactly 20 interview questions for:

Role: ${ROLE}
Difficulty: ${DIFFICULTY}

Return ONLY valid JSON.

Format:

[
 {
   "question":"...",
   "expectedAnswer":"...",
   "keywords":["...", "...", "..."]
 }
]

No explanation.
`;

    const response = await ollama.generate({
      model: "llama3.2:3b",
      prompt,
      stream: false,
    });

    const text = response.response.trim();

    const questions = JSON.parse(text);

    questions.forEach((q) => {
      db.run(
        `
INSERT INTO questions
(role,difficulty,category,skill,question,expectedAnswer,keywords)
VALUES(?,?,?,?,?,?,?)
`,
        [
          ROLE,
          DIFFICULTY,
          CATEGORY,
          "",
          q.question,
          q.expectedAnswer,
          JSON.stringify(q.keywords),
        ]
      );
    });

    console.log(`✅ ${questions.length} Questions Added`);

    db.close();
  } catch (err) {
    console.error(err);
  }
}

generateQuestions();