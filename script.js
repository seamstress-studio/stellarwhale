// script.js
let score = 0;
let autoClickers = 0;

const scoreDisplay = document.getElementById("score");
const clickerButton = document.getElementById("clicker");
const upgradeButton = document.getElementById("upgrade");

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

function updateScore() {
    scoreDisplay.textContent = score;
}

setInterval(function() {
    score += autoClickers * 5;
    updateScore();
}, 1000);

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
}

document.addEventListener("DOMContentLoaded", function() {
    showPage("actions");
});
