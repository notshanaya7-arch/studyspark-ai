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

    const notesBox = document.getElementById("studyNotes");
    const result = document.getElementById("summaryResult");
    const length = document.getElementById("summaryLength");

    if (!notesBox || !result) {
        return;
    }

    const notes = notesBox.value.trim();


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


    const sentences = notes
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0);


    let numberOfSentences = 4;


    if (length.value === "short") {
        numberOfSentences = 2;
    }

    if (length.value === "detailed") {
        numberOfSentences = 7;
    }


    const selectedSentences =
        sentences.slice(0, numberOfSentences);


    const summary =
        selectedSentences.join(". ") + ".";


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

    const fileInput =
        document.getElementById("studyFile");

    const uploadText =
        document.querySelector(".upload-area strong");


    if (fileInput && uploadText) {

        fileInput.addEventListener("change", function () {

            if (fileInput.files.length > 0) {

                const file =
                    fileInput.files[0];

                uploadText.textContent =
                    "📎 " + file.name;

            } else {

                uploadText.textContent =
                    "Click to upload your file";
            }

        });

    }

});
  
