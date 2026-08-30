// =========================
// STUDYSPARK AI JAVASCRIPT
// =========================


// DARK MODE
function toggleTheme() {
    document.body.classList.toggle("dark");
}


// SCROLL TO STUDY TOOLS
function scrollToTools() {
    document.getElementById("tools").scrollIntoView({
        behavior: "smooth"
    });
}


// HOME BUTTON
function showHome() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// OPEN TOOL
function openTool(tool) {

    if (tool === "summarizer") {
        alert("📝 AI Notes Summarizer is coming next!");
    }

    else if (tool === "quiz") {
        alert("❓ AI Quiz Generator is coming next!");
    }

    else if (tool === "flashcards") {
        alert("🃏 Flashcards are coming next!");
    }

    else if (tool === "assistant") {
        alert("🧠 AI Study Assistant is coming next!");
    }

    else if (tool === "planner") {
        alert("📅 Study Planner is coming next!");
    }

    else if (tool === "timer") {
        alert("⏱️ Focus Timer is coming next!");
    }

    else if (tool === "progress") {
        alert("📊 Progress Tracker is coming next!");
    }

    else if (tool === "teacher") {
        alert("👩‍🏫 AI Teacher is coming next!");
    }

}
   
