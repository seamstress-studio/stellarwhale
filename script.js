let score = 0;
const scoreDisplay = document.getElementById("score");

let actionSpeed = 1000; // Base speed (1 second per 100%)
let currentAction = null; // Track which action is in progress
let currentActionProgress = 0; // Track the progress of the current action

// Track button and progress bar elements for each action
const sealButton = document.getElementById("seal-the-hull");
const exploreButton = document.getElementById("explore-the-system");
const sealProgressBar = document.getElementById("seal-progress-bar");
const exploreProgressBar = document.getElementById("explore-progress-bar");

const sealCount = document.getElementById("seal-count");
const exploreCount = document.getElementById("explore-count");

// Start action function
function startAction(actionId, timeInSeconds, reward, progressBarElement, countElement, buttonElement) {
    // If another action is already in progress, stop it
    if (currentAction !== null) {
        stopAction();
    }

    currentAction = actionId;
    currentActionProgress = 0;

    buttonElement.disabled = true; // Disable the button while action is in progress

    const progressStep = 100 / (timeInSeconds * 1000 / actionSpeed); // How much to fill per interval

    // Update the progress bar for this action
    const interval = setInterval(() => {
        currentActionProgress += progressStep;
        progressBarElement.style.width = currentActionProgress + "%"; // Update progress bar

        if (currentActionProgress >= 100) {
            clearInterval(interval);
            currentActionProgress = 0; // Reset the progress for the next round
            countElement.textContent = parseInt(countElement.textContent) + 1; // Increase the count
            score += reward; // Reward the player with score
            updateDisplay(); // Update score display
            progressBarElement.style.width = "0%"; // Reset progress bar
            buttonElement.disabled = false; // Re-enable the button for the next round
        }
    }, actionSpeed);
}

// Stop the ongoing action
function stopAction() {
    currentAction = null;
    currentActionProgress = 0;
}

// Update the display score
function updateDisplay() {
    scoreDisplay.textContent = score;
}

// Action event listeners
sealButton.addEventListener("click", function () {
    startAction("seal-the-hull", 5, 10, sealProgressBar, sealCount, sealButton); // 5 sec for Seal the Hull, reward: 10
});

exploreButton.addEventListener("click", function () {
    startAction("explore-the-system", 10, 20, exploreProgressBar, exploreCount, exploreButton); // 10 sec for Explore the System, reward: 20
});

// Save and load game functionality
function saveGame() {
    const data = { score, actionSpeed };
    localStorage.setItem("incrementalSave", JSON.stringify(data));
}

function loadGame() {
    const savedData = localStorage.getItem("incrementalSave");
    if (savedData) {
        const data = JSON.parse(savedData);
        score = data.score;
        actionSpeed = data.actionSpeed;
        updateDisplay();
    }
}

document.getElementById("save-now").addEventListener("click", saveGame);
document.getElementById("load-file").addEventListener("click", function () {
    loadGame();
});

// Show page function
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
    loadGame();
    showPage("actions");
});
