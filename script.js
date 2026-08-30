/* =========================
   STUDYSPARK AI
   JAVASCRIPT
========================= */


/* =========================
   DARK MODE
========================= */

function toggleTheme() {
    document.body.classList.toggle("dark");
}


/* =========================
   GO TO TOOLS
========================= */

function scrollToTools() {
    const tools = document.getElementById("tools");

    if (tools) {
        tools.scrollIntoView({
            behavior: "smooth"
        });
    }
}


/* =========================
   HOME
========================= */

function showHome() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================
   OPEN TOOL
========================= */

function openTool(tool) {

    if (tool === "summarizer") {

        document.getElementById("summarizer")
            .scrollIntoView({
                behavior: "smooth"
            });

    }

    else if (tool === "quiz") {

        document.getElementById("quiz")
            .scrollIntoView({
                behavior: "smooth"
            });

    }

    else {

        alert(
            "✨ " +
            tool +
            " is coming soon!"
        );

    }
}


/* =========================
   NOTES SUMMARIZER
========================= */

function summarizeNotes() {

    const notesBox =
        document.getElementById("studyNotes");

    const result =
        document.getElementById("summaryResult");

    const length =
        document.getElementById("summaryLength");


    if (!notesBox || !result) {
        return;
    }


    const notes =
        notesBox.value.trim();


    if (notes === "") {

        result.innerHTML = `
            <h3>⚠️ Add your notes first</h3>

            <p>
                Paste your notes in the box
                and then click Summarize.
            </p>
        `;

        return;
    }


    const sentences =
        notes
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0);


    let numberOfSentences = 4;


    if (length) {

        if (length.value === "short") {
            numberOfSentences = 2;
        }

        else if (length.value === "detailed") {
            numberOfSentences = 7;
        }

    }


    const selected =
        sentences.slice(
            0,
            numberOfSentences
        );


    const summary =
        selected.join(". ") + ".";


    result.innerHTML = `
        <h3>✨ Your Summary</h3>

        <p>
            ${summary}
        </p>

        <br>

        <small>
            StudySpark AI created this
            summary from your notes.
        </small>
    `;
}


/* =========================
   FILE UPLOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const fileInput =
            document.getElementById("studyFile");

        const uploadText =
            document.querySelector(
                ".upload-area strong"
            );


        if (fileInput && uploadText) {

            fileInput.addEventListener(
                "change",
                function () {

                    if (
                        fileInput.files.length > 0
                    ) {

                        const file =
                            fileInput.files[0];

                        uploadText.textContent =
                            "📎 " + file.name;

                    }

                    else {

                        uploadText.textContent =
                            "Click to upload your file";

                    }

                }
            );

        }

    }
);


/* =========================
   AI QUIZ GENERATOR
========================= */

function generateQuiz() {

    const notesBox =
        document.getElementById("quizNotes");

    const result =
        document.getElementById("quizResult");

    const countBox =
        document.getElementById("questionCount");


    if (!notesBox || !result) {
        return;
    }


    const notes =
        notesBox.value.trim();


    if (notes === "") {

        result.innerHTML = `
            <h3>⚠️ Add your notes first</h3>

            <p>
                Paste your study notes above
                before generating a quiz.
            </p>
        `;

        return;
    }


    const sentences =
        notes
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 10);


    let questionCount = 5;


    if (countBox) {

        questionCount =
            parseInt(countBox.value);

    }


    if (sentences.length === 0) {

        result.innerHTML = `
            <h3>⚠️ Not enough information</h3>

            <p>
                Please enter a few complete
                sentences about your topic.
            </p>
        `;

        return;
    }


    const actualCount =
        Math.min(
            questionCount,
            sentences.length
        );


    let quizHTML = `
        <h3>🎯 Your Quiz</h3>

        <p>
            Choose the best answer for each question.
        </p>
    `;


    for (
        let i = 0;
        i < actualCount;
        i++
    ) {

        const sentence =
            sentences[i];


        const words =
            sentence.split(" ");


        let answer =
            words.length > 5
            ? words.slice(0, 5).join(" ")
            : sentence;


        quizHTML += `

            <div class="quiz-question">

                <h4>
                    Question ${i + 1}
                </h4>

                <p>
                    What is the main idea of this statement?
                </p>

                <label>
                    <input
                        type="radio"
                        name="question${i}"
                    >
                    ${sentence}
                </label>

                <label>
                    <input
                        type="radio"
                        name="question${i}"
                    >
                    It is unrelated to the topic.
                </label>

                <label>
                    <input
                        type="radio"
                        name="question${i}"
                    >
                    None of the information is important.
                </label>

            </div>

        `;
    }


    quizHTML += `

        <button
            class="summarize-button"
            onclick="finishQuiz()"
        >
            ✅ Finish Quiz
        </button>

    `;


    result.innerHTML =
        quizHTML;
}


/* =========================
   FINISH QUIZ
========================= */

function finishQuiz() {

    alert(
        "🎉 Great job! Keep studying with StudySpark AI!"
    );

}
