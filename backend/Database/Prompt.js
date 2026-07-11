function generatePrompt(role, difficulty, count = 20) {
  return `
You are an expert technical interviewer.

Generate EXACTLY ${count} interview questions.

Role: ${role}
Difficulty: ${difficulty}

Rules:

1. Return ONLY valid JSON.
2. Do NOT write any explanation.
3. Do NOT use markdown.
4. Do NOT use \`\`\`json.
5. Every question must be unique.

JSON Format:

[
  {
    "category": "OOP",
    "skill": "Java",
    "question": "What is polymorphism?",
    "expectedAnswer": "Polymorphism allows one interface to represent multiple implementations.",
    "keywords": [
      "polymorphism",
      "inheritance",
      "override"
    ]
  }
]

Return ONLY the JSON array.
`;
}

module.exports = generatePrompt;