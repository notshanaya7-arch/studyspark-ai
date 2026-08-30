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
/* =====================================================
   STUDYSPARK AI - EXTRA STUDY TOOLS
===================================================== */


/* =====================================================
   OPEN EXTRA TOOLS
===================================================== */

function openTool(tool) {

    const sections = {
        summarizer: "summarizer",
        quiz: "quiz",
        flashcards: "flashcards",
        assistant: "assistant",
        planner: "planner",
        timer: "timer",
        progress: "progress",
        teacher: "teacher"
    };

    const sectionId = sections[tool];

    if (sectionId) {

        const section =
            document.getElementById(sectionId);

        if (section) {

            section.scrollIntoView({
                behavior: "smooth"
            });

        }

    }

}


/* =====================================================
   SMART FLASHCARDS
===================================================== */

function createFlashcards() {

    const notes =
        document.getElementById("flashcardNotes").value.trim();

    const result =
        document.getElementById("flashcardResult");


    if (!notes) {

        result.innerHTML = `
            <div class="tool-result">
                <h3>⚠️ Add your notes first</h3>
                <p>
                    Paste your study material above.
                </p>
            </div>
        `;

        return;
    }


    const sentences =
        notes
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 20);


    if (sentences.length < 2) {

        result.innerHTML = `
            <div class="tool-result">
                <h3>⚠️ Add more information</h3>
                <p>
                    Add a few sentences so StudySpark
                    can create useful flashcards.
                </p>
            </div>
        `;

        return;
    }


    const cards =
        sentences.slice(0, 12);


    result.innerHTML = `

        <h3>🃏 Your Flashcards</h3>

        <p>
            Click a card to reveal the answer.
        </p>

        <div class="flashcard-grid">

            ${cards.map((sentence, index) => `

                <div
                    class="flashcard"
                    onclick="flipFlashcard(this)"
                >

                    <div class="flashcard-front">

                        <strong>
                            Card ${index + 1}
                        </strong>

                        <p>
                            What is the key idea?
                        </p>

                    </div>


                    <div class="flashcard-back">

                        <p>
                            ${sentence}
                        </p>

                    </div>

                </div>

            `).join("")}

        </div>
    `;
}


function flipFlashcard(card) {

    card.classList.toggle("flipped");

}


/* =====================================================
   STUDY PLANNER
===================================================== */

function createStudyPlan() {

    const subject =
        document.getElementById("plannerSubject")
        .value
        .trim();


    const hours =
        parseInt(
            document.getElementById("plannerHours").value
        );


    const result =
        document.getElementById("plannerResult");


    if (!subject || !hours) {

        result.innerHTML = `
            <div class="tool-result">
                <h3>⚠️ Enter your subject and time</h3>
            </div>
        `;

        return;
    }


    const tasks = [
        "Learn the main concepts",
        "Review important definitions",
        "Practice questions",
        "Review mistakes",
        "Quick final revision"
    ];


    let plan = "";

    const minutes =
        Math.max(
            15,
            Math.floor(
                (hours * 60) / tasks.length
            )
        );


    tasks.forEach(
        (task, index) => {

            plan += `

                <div class="plan-item">

                    <strong>
                        Session ${index + 1}
                    </strong>

                    <span>
                        ${task}
                    </span>

                    <small>
                        ${minutes} minutes
                    </small>

                </div>

            `;

        }
    );


    result.innerHTML = `

        <div class="tool-result">

            <h3>
                📅 Your ${subject} Study Plan
            </h3>

            ${plan}

        </div>

    `;

}


/* =====================================================
   FOCUS TIMER
===================================================== */

let timerSeconds = 25 * 60;
let timerInterval = null;


function updateTimerDisplay() {

    const display =
        document.getElementById("timerDisplay");


    if (!display) return;


    const minutes =
        Math.floor(timerSeconds / 60);


    const seconds =
        timerSeconds % 60;


    display.textContent =
        String(minutes).padStart(2, "0")
        + ":"
        + String(seconds).padStart(2, "0");

}


function startTimer() {

    if (timerInterval) return;


    timerInterval =
        setInterval(() => {

            if (timerSeconds > 0) {

                timerSeconds--;

                updateTimerDisplay();

            }

            else {

                clearInterval(timerInterval);

                timerInterval = null;

                alert(
                    "🎉 Focus session complete! Great work!"
                );

                addStudySession();

            }

        }, 1000);

}


function pauseTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

}


function resetTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    timerSeconds = 25 * 60;

    updateTimerDisplay();

}


document.addEventListener(
    "DOMContentLoaded",
    updateTimerDisplay
);


/* =====================================================
   PROGRESS TRACKER
===================================================== */

function getStudySessions() {

    return parseInt(
        localStorage.getItem(
            "studySparkSessions"
        ) || "0"
    );

}


function updateProgressDisplay() {

    const display =
        document.getElementById("sessionCount");


    if (display) {

        display.textContent =
            getStudySessions();

    }

}


function addStudySession() {

    const sessions =
        getStudySessions() + 1;


    localStorage.setItem(
        "studySparkSessions",
        sessions
    );


    updateProgressDisplay();

}


function resetProgress() {

    localStorage.setItem(
        "studySparkSessions",
        "0"
    );


    updateProgressDisplay();

}


document.addEventListener(
    "DOMContentLoaded",
    updateProgressDisplay
);


/* =====================================================
   AI TEACHER - STUDY EXPLANATION
===================================================== */

function explainTopic() {

    const input =
        document
        .getElementById("teacherTopic2");


    const result =
        document
        .getElementById("teacherExplanation");


    const topic =
        input.value.trim();


    if (!topic) {

        result.innerHTML = `
            <div class="tool-result">

                <h3>⚠️ Enter a topic</h3>

                <p>
                    Type the topic you want to learn.
                </p>

            </div>
        `;

        return;
    }


    result.innerHTML = `

        <div class="tool-result">

            <h3>
                👩‍🏫 Learning: ${topic}
            </h3>

            <p>
                StudySpark is preparing a simple
                explanation for this topic.
            </p>

            <div class="teacher-steps">

                <div>
                    <strong>1. Understand</strong>
                    <p>
                        Start with the basic meaning
                        of ${topic}.
                    </p>
                </div>

                <div>
                    <strong>2. Break it down</strong>
                    <p>
                        Divide the topic into smaller
                        concepts.
                    </p>
                </div>

                <div>
                    <strong>3. Practice</strong>
                    <p>
                        Test yourself with questions
                        and examples.
                    </p>
                </div>

            </div>

        </div>

    `;

}


/* =====================================================
   SIMPLE TEACHER CHAT
===================================================== */

function askTeacher() {

    const topic =
        document
        .getElementById("teacherTopic")
        .value
        .trim();


    const question =
        document
        .getElementById("teacherQuestion")
        .value
        .trim();


    const result =
        document
        .getElementById("teacherResult");


    if (!question) {

        result.innerHTML = `
            <div class="tool-result">

                <h3>⚠️ Ask a question first</h3>

            </div>
        `;

        return;
    }


    result.innerHTML = `

        <div class="tool-result">

            <h3>
                🤖 StudySpark Teacher
            </h3>

            <p>

                Your question about
                <strong>
                    ${topic || "your topic"}
                </strong>
                is:

            </p>

            <p>
                <strong>
                    ${question}
                </strong>
            </p>

            <hr>

            <p>
                💡 To answer this properly with
                real AI, we'll connect StudySpark
                to the AI backend in the next stage.
            </p>

        </div>

    `;

}

