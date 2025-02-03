// script.js
let score = 0;
let autoClickers = 0;
const scoreDisplay = document.getElementById("score");
const clickerButton = document.getElementById("clicker");
const upgradeButton = document.getElementById("upgrade");
const saveNowButton = document.getElementById("save-now");
const saveFileButton = document.getElementById("save-file");
const loadFileButton = document.getElementById("load-file");
const fileInput = document.getElementById("file-input");

// Load saved data from local storage
function loadGame() {
    const savedData = localStorage.getItem("incrementalSave");
    if (savedData) {
        const data = JSON.parse(savedData);
        score = data.score;
        autoClickers = data.autoClickers;
        updateScore();
    }
}

// Save game data to local storage
function saveGame() {
    const data = { score, autoClickers };
    localStorage.setItem("incrementalSave", JSON.stringify(data));
}

// Save game data to a file
function saveGameToFile() {
    const data = JSON.stringify({ score, autoClickers });
    const blob = new Blob([data], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "game_save.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Load game data from a file
function loadGameFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.score !== undefined && data.autoClickers !== undefined) {
                score = data.score;
                autoClickers = data.autoClickers;
                updateScore();
            } else {
                alert("Invalid save file.");
            }
        } catch {
            alert("Invalid save file.");
        }
    };
    reader.readAsText(file);
}

clickerButton.addEventListener("click", function() {
    score++;
    updateScore();
});

upgradeButton.addEventListener("click", function() {
    if (score >= 50) {
        score -= 50;
        autoClickers++;
        updateScore();
    }
});

saveNowButton.addEventListener("click", saveGame);
saveFileButton.addEventListener("click", saveGameToFile);
fileInput.addEventListener("change", loadGameFromFile);

function updateScore() {
    scoreDisplay.textContent = score;
}

setInterval(function() {
    score += autoClickers * 5;
    updateScore();
}, 1000);

setInterval(saveGame, 30000); // Auto-save every 30 seconds

document.addEventListener("DOMContentLoaded", function() {
    loadGame();
    showPage("actions");
});

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
}
