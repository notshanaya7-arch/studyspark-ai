function summarizeNotes() {

    const notes = document.getElementById("notes").value;

    if (notes.trim() === "") {
        alert("Please enter some notes first!");
        return;
    }

    document.getElementById("summary").innerHTML =
        "Your AI summary will appear here.";
}


function generateQuiz() {

    document.getElementById("quiz").innerHTML =
        "Your AI-generated quiz will appear here.";
}


function askAssistant() {

    const question =
        document.getElementById("question").value;

    if (question.trim() === "") {
        alert("Please ask a question!");
        return;
    }

    document.getElementById("answer").innerHTML =
        "Your AI assistant response will appear here.";
}


function toggleTheme() {

    document.body.classList.toggle("dark");
}
