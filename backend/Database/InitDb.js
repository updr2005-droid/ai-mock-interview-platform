const db = require("./db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      role TEXT NOT NULL,
      difficulty TEXT NOT NULL,

      category TEXT,
      company TEXT,
      language TEXT DEFAULT 'English',

      skill TEXT,

      question TEXT NOT NULL UNIQUE,

      expectedAnswer TEXT,

      keywords TEXT,

      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Questions table created.");
});

db.close();