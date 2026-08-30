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
   GO TO STUDY TOOLS
========================= */

function scrollToTools() {
    document.getElementById("tools").scrollIntoView({
        behavior: "smooth"
    });
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
   OPEN TOOLS
========================= */

function openTool(tool) {

    if (tool === "summarizer") {

        document.getElementById("summarizer").scrollIntoView({
            behavior: "smooth"
        });

        return;
    }

    alert("✨ " + tool + " will be available soon!");
}


/* =========================
   NOTES SUMMARIZER
========================= */

function summarizeNotes() {

    const notes = document.getElementById("studyNotes").value.trim();

    const result = document.getElementById("summaryResult");

    const length = document.getElementById("summaryLength").value;


    if (notes === "") {

        result.innerHTML = `
            <h3>⚠️ Add your notes first</h3>
            <p>
                Please paste or type your study notes
                in the box above.
            </p>
        `;

        return;
    }


    let sentences = notes
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0);


    let numberOfSentences;


    if (length === "short") {

        numberOfSentences = 2;

    } else if (length === "medium") {

        numberOfSentences = 4;

    } else {

        numberOfSentences = 7;
    }


    const summary = sentences
        .slice(0, numberOfSentences)
        .join(". ") + ".";


    result.innerHTML = `
        <h3>✨ Your Summary</h3>

        <p>${summary}</p>

        <br>

        <small>
            StudySpark AI created this summary from your notes.
        </small>
    `;
}


/* =========================
   FILE UPLOAD
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const fileInput = document.getElementById("studyFile");


    if (fileInput) {

        fileInput.addEventListener("change", function () {

            if (fileInput.files.length > 0) {

                const fileName = fileInput.files[0].name;

                const uploadArea =
                    document.querySelector(".upload-area strong");

                uploadArea.textContent =
                    "📎 " + fileName;
            }

        });

    }

});
