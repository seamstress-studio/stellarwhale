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
