function validateQuestion(question) {
  if (!question) return false;

  if (!question.question) return false;

  if (!question.expectedAnswer) return false;

  if (!Array.isArray(question.keywords)) return false;

  if (question.keywords.length < 2) return false;

  return true;
}

module.exports = validateQuestion;