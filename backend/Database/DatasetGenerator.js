const ollama = require("ollama").default;

const generatePrompt = require("./prompt");
const extractJSONArray = require("./parser");
const validateQuestion = require("./validator");

async function generateBatch() {
    try {

        const prompt = generatePrompt(
            "Software Engineer",
            "Easy",
            10
        );

        console.log("Generating Questions...\n");

      const response = await ollama.generate({
    model: "llama3.2:3b",
    prompt,
    stream: false,
    options:{
        num_predict:3000
    }
});
        console.log("========== RAW OUTPUT ==========");
        console.log(response.response);
        console.log("================================");

        const questions = extractJSONArray(response.response);

        const validQuestions = questions.filter(validateQuestion);

        console.log("Generated :", questions.length);

        console.log("Valid :", validQuestions.length);

        console.log(validQuestions);

    } catch (err) {

        console.error(err.message);

    }
}

generateBatch();