/* =====================================================
   STUDYSPARK AI
   REAL STUDY WEBSITE JAVASCRIPT
===================================================== */


/* =====================================================
   GLOBAL STATE
===================================================== */

let currentQuiz = [];
let currentQuestion = 0;
let userAnswers = [];
let quizScore = 0;


/* =====================================================
   DARK MODE
===================================================== */

function toggleTheme() {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "studySparkDarkMode",
        document.body.classList.contains("dark")
    );
}


/* Restore dark mode */

document.addEventListener("DOMContentLoaded", () => {

    const darkMode =
        localStorage.getItem("studySparkDarkMode");

    if (darkMode === "true") {
        document.body.classList.add("dark");
    }

});


/* =====================================================
   NAVIGATION
===================================================== */

function scrollToTools() {

    const tools =
        document.getElementById("tools");

    if (tools) {
        tools.scrollIntoView({
            behavior: "smooth"
        });
    }
}


function showHome() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function openTool(tool) {

    if (tool === "summarizer") {

        document
            .getElementById("summarizer")
            .scrollIntoView({
                behavior: "smooth"
            });

        return;
    }


    if (tool === "quiz") {

        document
            .getElementById("quiz")
            .scrollIntoView({
                behavior: "smooth"
            });

        return;
    }


    alert(
        "🚀 " +
        tool +
        " is coming soon!"
    );
}


/* =====================================================
   NOTES SUMMARIZER
===================================================== */

function summarizeNotes() {

    const notes =
        document
        .getElementById("studyNotes")
        .value
        .trim();


    const result =
        document
        .getElementById("summaryResult");


    if (!notes) {

        result.innerHTML = `
            <h3>⚠️ No notes yet</h3>

            <p>
                Paste your notes above first.
            </p>
        `;

        return;
    }


    const sentences =
        notes
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 20);


    const length =
        document
        .getElementById("summaryLength")
        .value;


    let amount = 3;


    if (length === "short") {
        amount = 2;
    }


    if (length === "detailed") {
        amount = 7;
    }


    const selected =
        sentences.slice(0, amount);


    result.innerHTML = `

        <h3>✨ Your Summary</h3>

        <p>
            ${selected.join(". ")}.
        </p>

        <small>
            StudySpark AI
        </small>

    `;
}


/* =====================================================
   FILE UPLOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const fileInput =
            document.getElementById("studyFile");


        const uploadText =
            document.querySelector(
                ".upload-area strong"
            );


        if (
            fileInput &&
            uploadText
        ) {

            fileInput.addEventListener(
                "change",
                () => {

                    if (
                        fileInput.files.length
                    ) {

                        const file =
                            fileInput.files[0];


                        uploadText.textContent =
                            "📎 " +
                            file.name;

                    }

                }
            );

        }

    }
);


/* =====================================================
   QUIZ GENERATOR
===================================================== */

function generateQuiz() {

    const notesBox =
        document
        .getElementById("quizNotes");


    const result =
        document
        .getElementById("quizResult");


    const countBox =
        document
        .getElementById("questionCount");


    const notes =
        notesBox.value.trim();


    if (!notes) {

        result.innerHTML = `

            <h3>⚠️ Add your study material</h3>

            <p>
                Paste your notes or topic
                before generating your quiz.
            </p>

        `;

        return;
    }


    /* ---------------------------------------------
       Extract meaningful sentences
    --------------------------------------------- */

    let sentences =
        notes
        .replace(/\n+/g, " ")
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(
            s => s.length >= 25
        );


    if (sentences.length < 3) {

        result.innerHTML = `

            <h3>⚠️ More information needed</h3>

            <p>
                Add more detailed notes so
                StudySpark can create different
                questions.
            </p>

        `;

        return;
    }


    /* ---------------------------------------------
       Shuffle sentences
    --------------------------------------------- */

    sentences =
        shuffleArray(sentences);


    const requested =
        parseInt(
            countBox.value
        );


    const amount =
        Math.min(
            requested,
            sentences.length
        );


    /* ---------------------------------------------
       Build DIFFERENT question types
    --------------------------------------------- */

    currentQuiz = [];


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const sentence =
            sentences[i];


        const words =
            sentence
            .split(/\s+/)
            .filter(
                word =>
                    word.length > 4
            );


        let answer =
            words.length
            ? words[
                Math.floor(
                    Math.random() *
                    words.length
                )
            ]
            : sentence;


        answer =
            answer
            .replace(
                /[^a-zA-Z0-9]/g,
                ""
            );


        const questionTypes = [
            "definition",
            "mainIdea",
            "trueFalse",
            "keyword"
        ];


        const type =
            questionTypes[
                i %
                questionTypes.length
            ];


        let question;


        if (type === "definition") {

            question =
                `Which concept is described by: "${sentence}"?`;

        }


        else if (
            type === "mainIdea"
        ) {

            question =
                `What is the main idea of this statement: "${sentence}"?`;

        }


        else if (
            type === "trueFalse"
        ) {

            question =
                `True or False: "${sentence}".`;

        }


        else {

            question =
                `Which important term appears in this idea: "${sentence}"?`;

        }


        currentQuiz.push({

            question:
                question,

            answer:
                answer,

            original:
                sentence,

            type:
                type

        });

    }


    currentQuestion = 0;

    userAnswers = [];

    quizScore = 0;


    showQuizQuestion();

}


/* =====================================================
   SHOW QUESTION
===================================================== */

function showQuizQuestion() {

    const result =
        document
        .getElementById("quizResult");


    if (
        currentQuestion >=
        currentQuiz.length
    ) {

        showQuizResults();

        return;
    }


    const quiz =
        currentQuiz[
            currentQuestion
        ];


    const questionNumber =
        currentQuestion + 1;


    const total =
        currentQuiz.length;


    /* ---------------------------------------------
       Create different answer choices
    --------------------------------------------- */

    const wrongAnswers =
        currentQuiz
        .filter(
            (_, index) =>
                index !== currentQuestion
        )
        .map(
            item =>
                item.answer
        );


    let choices =
        [quiz.answer];


    wrongAnswers.forEach(
        wrong => {

            if (
                wrong &&
                wrong !== quiz.answer &&
                choices.length < 4
            ) {

                choices.push(wrong);

            }

        }
    );


    while (
        choices.length < 4
    ) {

        choices.push(
            "None of these"
        );

    }


    choices =
        shuffleArray(
            choices
        );


    result.innerHTML = `

        <div class="quiz-progress">

            Question
            ${questionNumber}
            of
            ${total}

        </div>


        <div class="quiz-question">

            <h4>
                ${quiz.question}
            </h4>


            <div class="quiz-choices">

                ${choices.map(
                    (choice, index) => `

                    <button
                        class="quiz-choice"
                        onclick="selectAnswer(
                            ${JSON.stringify(choice)}
                        )"
                    >

                        <span>
                            ${String.fromCharCode(
                                65 + index
                            )}
                        </span>

                        ${choice}

                    </button>

                `).join("")}

            </div>

        </div>

    `;
}


/* =====================================================
   SELECT ANSWER
===================================================== */

function selectAnswer(choice) {

    const quiz =
        currentQuiz[
            currentQuestion
        ];


    const result =
        document
        .getElementById("quizResult");


    const buttons =
        document.querySelectorAll(
            ".quiz-choice"
        );


    buttons.forEach(
        button => {

            button.disabled = true;


            const text =
                button.textContent
                .trim()
                .substring(1)
                .trim();


            if (
                text === quiz.answer
            ) {

                button.classList.add(
                    "correct"
                );

            }


            if (
                text === choice &&
                choice !== quiz.answer
            ) {

                button.classList.add(
                    "wrong"
                );

            }

        }
    );


    if (
        choice === quiz.answer
    ) {

        quizScore++;

        result.innerHTML += `

            <div class="answer-feedback">

                ✅ Correct!

            </div>

        `;

    }

    else {

        result.innerHTML += `

            <div class="answer-feedback">

                ❌ Not quite.
                <br>
                Correct answer:
                <strong>
                    ${quiz.answer}
                </strong>

            </div>

        `;

    }


    userAnswers.push({
        question:
            quiz.question,

        selected:
            choice,

        correct:
            quiz.answer
    });


    result.innerHTML += `

        <button
            class="summarize-button next-question"
            onclick="nextQuestion()"
        >

            ${
                currentQuestion <
                currentQuiz.length - 1
                ? "Next Question →"
                : "See My Results 🎉"
            }

        </button>

    `;

}


/* =====================================================
   NEXT QUESTION
===================================================== */

function nextQuestion() {

    currentQuestion++;

    showQuizQuestion();

}


/* =====================================================
   QUIZ RESULTS
===================================================== */

function showQuizResults() {

    const result =
        document
        .getElementById("quizResult");


    const total =
        currentQuiz.length;


    const percentage =
        Math.round(
            (quizScore / total) *
            100
        );


    let message;


    if (percentage >= 90) {

        message =
            "🔥 Amazing! You really know this topic!";

    }

    else if (percentage >= 70) {

        message =
            "🌟 Great job! Keep practicing!";

    }

    else if (percentage >= 50) {

        message =
            "💪 Good start! A little more revision will help.";

    }

    else {

        message =
            "📚 Keep studying! You can improve this score.";

    }


    result.innerHTML = `

        <div class="quiz-final-result">

            <div class="result-icon">
                🏆
            </div>

            <h3>
                Quiz Complete!
            </h3>


            <div class="score">

                ${quizScore}
                /
                ${total}

            </div>


            <p>
                ${percentage}%
            </p>


            <strong>
                ${message}
            </strong>


            <br><br>


            <button
                class="summarize-button"
                onclick="restartQuiz()"
            >

                🔄 Retake Quiz

            </button>

        </div>

    `;

}


/* =====================================================
   RESTART QUIZ
===================================================== */

function restartQuiz() {

    currentQuiz = [];

    currentQuestion = 0;

    userAnswers = [];

    quizScore = 0;


    generateQuiz();

}


/* =====================================================
   SHUFFLE
===================================================== */

function shuffleArray(array) {

    const copy =
        [...array];


    for (
        let i =
            copy.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            copy[i],
            copy[j]
        ] = [
            copy[j],
            copy[i]
        ];

    }


    return copy;
}


