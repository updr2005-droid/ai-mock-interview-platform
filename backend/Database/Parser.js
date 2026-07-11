function extractJSONArray(text) {
  if (!text) return [];

  // Remove markdown
  text = text.replace(/```json/gi, "");
  text = text.replace(/```/g, "");

  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("JSON array not found.");
  }

  const json = text.substring(start, end + 1);

  return JSON.parse(json);
}

module.exports = extractJSONArray;