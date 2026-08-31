const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/study", async (req, res) => {

    try {

        const { mode, notes, question } = req.body;

        if (!notes) {
            return res.status(400).json({
                error: "Please provide study notes."
            });
        }

        let instruction = "";

        if (mode === "summary") {

            instruction = `
Summarize these study notes clearly.
Use simple language.
Give important points and key terms.
Do not invent information.
`;

        } else if (mode === "quiz") {

            instruction = `
Create 10 different quiz questions from these notes.

For every question provide:
1. Question
2. Four answer choices
3. Correct answer
4. Short explanation

Make the questions different from each other.
Only use information from the notes.
`;

        } else if (mode === "flashcards") {

            instruction = `
Create useful study flashcards from these notes.

Each flashcard must have:
FRONT: a specific question about the material
BACK: the correct answer

Do NOT repeatedly ask "What is the main idea?"
Make questions about definitions, facts, processes, causes, effects,
examples and important concepts when the notes contain them.
`;

        } else if (mode === "teacher") {

            instruction = `
Act like a friendly personal teacher.

Explain the material using simple language.
Break difficult concepts into small steps.
Give examples when the notes support them.
If the student asks a question, answer it using the notes.
Do not invent facts that aren't supported by the notes.

Student question:
${question || "Explain these notes to me."}
`;

        } else {

            instruction = `
Help the student understand these study notes.
Answer their question clearly and simply.

Student question:
${question || "Help me understand these notes."}
`;

        }


        const response = await client.responses.create({

            model: "gpt-5-mini",

            input: `
${instruction}

STUDY NOTES:

${notes}
`

        });


        res.json({
            answer: response.output_text
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Something went wrong while connecting to the AI."
        });

    }

});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `StudySpark AI server running on port ${PORT}`
    );

});
