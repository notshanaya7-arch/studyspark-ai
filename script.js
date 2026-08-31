/* =========================================
   STUDYSPARK AI - MAIN JAVASCRIPT
========================================= */


/* =========================================
   NAVIGATION
========================================= */

function goTo(id) {

    const element = document.getElementById(id);

    if (element) {
        element.scrollIntoView({
            behavior: "smooth"
        });
    }

}

function goHome() {
    goTo("home");
}


/* =========================================
   DARK MODE
========================================= */

function toggleDark() {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "studySparkDark",
        document.body.classList.contains("dark")
    );

}

if (localStorage.getItem("studySparkDark") === "true") {
    document.body.classList.add("dark");
}


/* =========================================
   FILE UPLOAD SYSTEM
========================================= */

function setupFile(inputId, textareaId, nameId) {

    const input = document.getElementById(inputId);
    const textarea = document.getElementById(textareaId);
    const fileName = document.getElementById(nameId);

    if (!input || !textarea) return;

    input.addEventListener("change", function () {

        const file = input.files[0];

        if (!file) return;

        if (fileName) {
            fileName.textContent = "📎 " + file.name;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            textarea.value = event.target.result;

        };

        reader.readAsText(file);

    });

}


/* Uploaders for every feature */

setupFile(
    "summaryFile",
    "summaryNotes",
    "summaryFileName"
);

setupFile(
    "quizFile",
    "quizNotes",
    "quizFileName"
);

setupFile(
    "flashcardFile",
    "flashcardNotes",
    "flashcardFileName"
);

setupFile(
    "teacherFile",
    "teacherNotes",
    "teacherFileName"
);

setupFile(
    "assistantFile",
    "assistantNotes",
    "assistantFileName"
);


/* =========================================
   TEXT HELPERS
========================================= */

function cleanText(text) {

    return text
        .replace(/\s+/g, " ")
        .trim();

}

function getSentences(text) {

    return text
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 15);

}

function getWords(text) {

    return cleanText(text)
        .split(/\s+/)
        .filter(Boolean);

}


/* =========================================
   HTML SAFETY
========================================= */

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   AI SUMMARIZER
========================================= */

function summarizeNotes() {

    const textarea =
        document.getElementById("summaryNotes");

    const result =
        document.getElementById("summaryResult");

    const text = textarea.value.trim();

    if (!text) {

        result.innerHTML = `
            <h3>📚 Add Your Notes First</h3>
            <p>
                Upload a file or paste your notes above.
            </p>
        `;

        return;

    }

    const sentenceList = getSentences(text);

    let summary = sentenceList.slice(0, 8);

    if (summary.length === 0) {
        summary = [text];
    }

    result.innerHTML = `

        <h3>✨ Your Summary</h3>

        <ul style="
            padding-left:20px;
            line-height:1.8;
        ">

            ${summary.map(sentence => `
                <li>
                    ${escapeHTML(sentence)}.
                </li>
            `).join("")}

        </ul>

        <p style="margin-top:20px;">
            💡 Read these key points once,
            then try explaining them without looking.
        </p>

    `;

    addProgress();

}


/* =========================================
   QUIZ GENERATOR
========================================= */

let currentQuiz = [];


function generateQuiz() {

    const textarea =
        document.getElementById("quizNotes");

    const result =
        document.getElementById("quizResult");

    const count =
        Number(
            document.getElementById("questionCount").value
        );

    const text = textarea.value.trim();

    if (!text) {

        result.innerHTML = `

            <div class="result-box">

                <h3>📚 Add Your Notes First</h3>

                <p>
                    Upload a file or paste your notes
                    before creating the quiz.
                </p>

            </div>

        `;

        return;

    }


    let sentenceList = getSentences(text);


    /*
       If the notes have very few sentences,
       create smaller sections from the words.
    */

    if (sentenceList.length < 3) {

        const allWords = getWords(text);

        sentenceList = [];

        for (
            let i = 0;
            i < allWords.length;
            i += 12
        ) {

            sentenceList.push(
                allWords.slice(i, i + 12).join(" ")
            );

        }

    }


    currentQuiz = [];


    const total =
        Math.min(count, sentenceList.length);


    for (let i = 0; i < total; i++) {

        const sentence = sentenceList[i];

        const wordList =
            sentence
                .replace(/[,.!?]/g, "")
                .split(" ")
                .filter(word => word.length > 4);


        if (wordList.length === 0) {
            continue;
        }


        /*
           Pick a different important word
           for each question.
        */

        const answer =
            wordList[i % wordList.length];


        const question =
            sentence.replace(
                new RegExp(
                    "\\b" +
                    answer.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    ) +
                    "\\b",
                    "i"
                ),
                "_____"
            );


        const wrongAnswers = [];


        for (let j = 1; j < wordList.length; j++) {

            const wrong =
                wordList[
                    (i + j) % wordList.length
                ];

            if (
                wrong.toLowerCase() !==
                answer.toLowerCase() &&
                !wrongAnswers.includes(wrong)
            ) {

                wrongAnswers.push(wrong);

            }

            if (wrongAnswers.length >= 3) {
                break;
            }

        }


        while (wrongAnswers.length < 3) {

            wrongAnswers.push(
                "Not mentioned"
            );

        }


        let options = [
            answer,
            ...wrongAnswers
        ];


        /* Shuffle answers */

        for (
            let j = options.length - 1;
            j > 0;
            j--
        ) {

            const random =
                Math.floor(
                    Math.random() * (j + 1)
                );

            [
                options[j],
                options[random]
            ] =
            [
                options[random],
                options[j]
            ];

        }


        currentQuiz.push({

            question: question,

            answer: answer,

            options: options

        });

    }


    renderQuiz();

}


function renderQuiz() {

    const result =
        document.getElementById("quizResult");


    if (currentQuiz.length === 0) {

        result.innerHTML = `
            <div class="result-box">
                <h3>Not enough information</h3>
                <p>
                    Add more detailed notes and try again.
                </p>
            </div>
        `;

        return;

    }


    result.innerHTML = `

        <div class="result-box">

            <h3>🎯 Your Quiz</h3>

            <p>
                Choose one answer for each question.
            </p>

            ${currentQuiz.map((quiz, index) => `

                <div class="quiz-question">

                    <h4>
                        ${index + 1}.
                        ${escapeHTML(quiz.question)}
                    </h4>

                    ${quiz.options.map(option => `

                        <label class="quiz-option">

                            <input
                                type="radio"
                                name="question${index}"
                                value="${escapeHTML(option)}"
                            >

                            ${escapeHTML(option)}

                        </label>

                    `).join("")}

                </div>

            `).join("")}


            <button
                class="action-button"
                onclick="checkQuiz()"
            >
                ✅ Check Answers
            </button>

            <div id="quizScore"></div>

        </div>

    `;

}


function checkQuiz() {

    let score = 0;


    currentQuiz.forEach((quiz, index) => {

        const selected =
            document.querySelector(
                `input[name="question${index}"]:checked`
            );


        if (
            selected &&
            selected.value === quiz.answer
        ) {

            score++;

        }

    });


    const scoreBox =
        document.getElementById("quizScore");


    const percentage =
        Math.round(
            (score / currentQuiz.length) * 100
        );


    let message = "";

    if (percentage === 100) {
        message = "🔥 PERFECT SCORE!";
    }
    else if (percentage >= 80) {
        message = "🌟 Amazing work!";
    }
    else if (percentage >= 60) {
        message = "👍 Good job!";
    }
    else {
        message = "📚 Keep practicing!";
    }


    scoreBox.innerHTML = `

        <div class="quiz-score">

            ${message}

            <br><br>

            You scored
            ${score}/${currentQuiz.length}

            <br>

            ${percentage}%

            <button
                class="action-button"
                onclick="generateQuiz()"
            >
                🔄 Generate New Quiz
            </button>

        </div>

    `;

    addProgress();

}


/* =========================================
   FLASHCARDS
========================================= */

let flashcards = [];
let flashcardIndex = 0;


function createFlashcards() {

    const textarea =
        document.getElementById("flashcardNotes");

    const result =
        document.getElementById("flashcardResult");

    const text =
        textarea.value.trim();


    if (!text) {

        result.innerHTML = `

            <div class="result-box">

                <h3>📚 Add Your Notes First</h3>

                <p>
                    Upload a file or paste your notes.
                </p>

            </div>

        `;

        return;

    }


    const sentenceList =
        getSentences(text);


    flashcards = [];


    sentenceList
        .slice(0, 15)
        .forEach((sentence, index) => {

            const words =
                sentence.split(" ");


            const importantWord =
                words.find(
                    word =>
                    word.replace(/[,.!?]/g, "").length > 6
                );


            flashcards.push({

                question:
                    "What is the key idea in this statement?",

                answer:
                    sentence +
                    (
                        importantWord
                        ? `\n\nKey term: ${importantWord}`
                        : ""
                    )

            });

        });


    if (flashcards.length === 0) {

        flashcards.push({

            question:
                "What is the main idea of your notes?",

            answer:
                text

        });

    }


    flashcardIndex = 0;

    renderFlashcard();

    addProgress();

}


function renderFlashcard() {

    const result =
        document.getElementById("flashcardResult");


    const card =
        flashcards[flashcardIndex];


    result.innerHTML = `

        <div class="result-box">

            <p style="text-align:center;">
                Card ${flashcardIndex + 1}
                of ${flashcards.length}
            </p>


            <div
                class="flashcard"
                onclick="
                    this.classList.toggle('flipped')
                "
            >

                <div class="flashcard-inner">

                    <div class="flash-front">

                        ${escapeHTML(card.question)}

                    </div>


                    <div class="flash-back">

                        ${escapeHTML(card.answer)}

                    </div>

                </div>

            </div>


            <p style="text-align:center;">
                👆 Click the card to flip it
            </p>


            <div class="flash-controls">

                <button onclick="previousCard()">
                    ← Previous
                </button>

                <button onclick="nextCard()">
                    Next →
                </button>

            </div>

        </div>

    `;

}


function nextCard() {

    if (flashcards.length === 0) {
        return;
    }


    flashcardIndex =
        (flashcardIndex + 1)
        % flashcards.length;


    renderFlashcard();

}


function previousCard() {

    if (flashcards.length === 0) {
        return;
    }


    flashcardIndex =
        (flashcardIndex - 1 + flashcards.length)
        % flashcards.length;


    renderFlashcard();

}


/* =========================================
   AI TEACHER
========================================= */

function teachTopic() {

    const notes =
        document.getElementById("teacherNotes")
            .value.trim();


    const question =
        document.getElementById("teacherQuestion")
            .value.trim();


    const result =
        document.getElementById("teacherResult");


    if (!notes) {

        result.innerHTML = `

            <div class="chat-message ai-message">

                📚 Please upload or paste your study
                material first.

            </div>

        `;

        return;

    }


    const sentences =
        getSentences(notes)
            .slice(0, 5);


    const topic =
        question ||
        "this topic";


    result.innerHTML = `

        <div class="chat-message user-message">

            You asked:

            <strong>
                ${escapeHTML(topic)}
            </strong>

        </div>


        <div class="chat-message ai-message">

            <strong>
                👩‍🏫 StudySpark Teacher
            </strong>

            <p style="margin-top:12px;">

                Let's make this easy.

                Here are the important ideas
                from your material:

            </p>


            <ul style="
                margin-top:12px;
                padding-left:20px;
                line-height:1.8;
            ">

                ${sentences.map(sentence => `

                    <li>
                        ${escapeHTML(sentence)}
                    </li>

                `).join("")}

            </ul>


            <p style="margin-top:15px;">

                💡 <strong>Study tip:</strong>

                Read these points, close your notes,
                and explain the topic in your own words.

            </p>

        </div>

    `;

    addProgress();

}


/* =========================================
   STUDY ASSISTANT
========================================= */

function askAssistant() {

    const notes =
        document.getElementById("assistantNotes")
            .value.trim();


    const question =
        document.getElementById("assistantQuestion")
            .value.trim();


    const result =
        document.getElementById("assistantResult");


    if (!notes) {

        result.innerHTML = `

            <div class="chat-message ai-message">

                📚 Please add your study material first.

            </div>

        `;

        return;

    }


    if (!question) {

        result.innerHTML = `

            <div class="chat-message ai-message">

                💬 Type a question about your notes.

            </div>

        `;

        return;

    }


    const questionWords =
        question
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 4);


    const relevant =
        getSentences(notes)
            .filter(sentence => {

                const lower =
                    sentence.toLowerCase();

                return questionWords.some(
                    word =>
                    lower.includes(word)
                );

            })
            .slice(0, 3);


    let answer;


    if (relevant.length > 0) {

        answer =
            relevant.join(". ") + ".";

    }
    else {

        answer =
            "I couldn't find an exact answer in the material you provided. Try asking about a specific word, concept, or sentence from your notes.";

    }


    result.innerHTML = `

        <div class="chat-message user-message">

            ${escapeHTML(question)}

        </div>


        <div class="chat-message ai-message">

            <strong>
                🤖 StudySpark
            </strong>

            <p style="margin-top:10px;">

                ${escapeHTML(answer)}

            </p>

        </div>

    `;

    addProgress();

}


/* =========================================
   STUDY PLANNER
========================================= */

let tasks =
    JSON.parse(
        localStorage.getItem(
            "studySparkTasks"
        ) || "[]"
    );


function addTask() {

    const input =
        document.getElementById("taskInput");


    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    tasks.push({

        text: text,

        done: false

    });


    input.value = "";


    saveTasks();

    renderTasks();

}


function saveTasks() {

    localStorage.setItem(
        "studySparkTasks",
        JSON.stringify(tasks)
    );

}


function renderTasks() {

    const list =
        document.getElementById("taskList");


    if (!list) {
        return;
    }


    if (tasks.length === 0) {

        list.innerHTML = `

            <p>
                📚 No study tasks yet.
            </p>

        `;

        return;

    }


    list.innerHTML =
        tasks.map((task, index) => `

            <div style="
                display:flex;
                align-items:center;
                gap:10px;
                margin:12px 0;
            ">

                <input
                    type="checkbox"
                    ${task.done ? "checked" : ""}
                    onchange="toggleTask(${index})"
                >


                <span style="
                    flex:1;
                    text-decoration:
                    ${task.done
                        ? "line-through"
                        : "none"};
                ">

                    ${escapeHTML(task.text)}

                </span>


                <button
                    onclick="deleteTask(${index})"
                    style="
                        border:none;
                        background:#ff6b81;
                        color:white;
                        padding:8px 10px;
                        border-radius:8px;
                    "
                >

                    🗑

                </button>

            </div>

        `).join("");

}


function toggleTask(index) {

    tasks[index].done =
        !tasks[index].done;


    saveTasks();

    renderTasks();

    addProgress();

}


function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();

    renderTasks();

}


/* =========================================
   FOCUS TIMER
========================================= */

let timerSeconds = 25 * 60;

let timerInterval = null;


function updateTimer() {

    const display =
        document.getElementById("timerDisplay");


    if (!display) {
        return;
    }


    const minutes =
        Math.floor(
            timerSeconds / 60
        );


    const seconds =
        timerSeconds % 60;


    display.textContent =

        String(minutes).padStart(2, "0")
        +
        ":"
        +
        String(seconds).padStart(2, "0");

}


function startTimer() {

    if (timerInterval) {
        return;
    }


    timerInterval =
        setInterval(function () {

            if (timerSeconds > 0) {

                timerSeconds--;

                updateTimer();

            }
            else {

                clearInterval(
                    timerInterval
                );

                timerInterval = null;


                alert(
                    "🎉 Focus session complete!"
                );


                addProgress();

            }

        }, 1000);

}


function pauseTimer() {

    clearInterval(
        timerInterval
    );

    timerInterval = null;

}


function resetTimer() {

    pauseTimer();

    timerSeconds =
        25 * 60;

    updateTimer();

}


/* =========================================
   PROGRESS
========================================= */

let progress =
    Number(
        localStorage.getItem(
            "studySparkProgress"
        ) || 0
    );


function addProgress() {

    progress++;


    localStorage.setItem(
        "studySparkProgress",
        progress
    );


    renderProgress();

}


function renderProgress() {

    const result =
        document.getElementById(
            "progressResult"
        );


    if (!result) {
        return;
    }


    result.innerHTML = `

        <h3>
            🌟 Your Study Progress
        </h3>


        <p style="
            font-size:42px;
            font-weight:900;
            color:#7567ff;
            margin:20px 0;
        ">

            ${progress}

        </p>


        <p>
            study activities completed.
        </p>


        <p style="margin-top:15px;">

            Keep going! 🚀
            Every study session counts.

        </p>

    `;

}


/* =========================================
   STARTUP
========================================= */

renderTasks();

renderProgress();

updateTimer();


/*
   The intro animation finishes automatically.
*/

setTimeout(function () {

    const intro =
        document.getElementById("intro");


    if (intro) {

        intro.style.pointerEvents =
            "none";

    }

}, 4500);


