const db = require("./db");

function saveQuestion(data) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT OR IGNORE INTO questions
      (
        role,
        difficulty,
        category,
        company,
        language,
        skill,
        question,
        expectedAnswer,
        keywords
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.role,
        data.difficulty,
        data.category,
        data.company || "",
        data.language || "English",
        data.skill,
        data.question,
        data.expectedAnswer,
        JSON.stringify(data.keywords),
      ],
      function (err) {
        if (err) return reject(err);

        resolve(this.changes);
      }
    );
  });
}

module.exports = {
  saveQuestion,
};