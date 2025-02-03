let score = 0;
const scoreDisplay = document.getElementById("score");

let currentAction = null; // Track which action is in progress
let progress = 0; // Progress of the current action
let actionStartTime = null; // Time when the action started
let actionDuration = 0; // Duration of the current action
let progressBarElement = null; // Progress bar element
let actionButtonElement = null; // Action button element
let actionCountElement = null; // Action count element

// Start action function
function startAction(actionId, timeInSeconds, reward, progressBar, button, countElement) {
    if (currentAction !== null) {
        stopAction();
    }

    // Initialize the new action
    currentAction = actionId;
    actionStartTime = Date.now();
    actionDuration = timeInSeconds * 1000; // Convert seconds to milliseconds
    progress = 0;

    progressBarElement = progressBar;
    actionButtonElement = button;
    actionCountElement = countElement;

    button.disabled = true; // Disable the button while the action is in progress

    // Start the animation loop to fill the progress bar
    requestAnimationFrame(updateProgressBar);
}

// Update the progress bar and handle completion
function updateProgressBar() {
    const elapsedTime = Date.now() - actionStartTime;
    progress = (elapsedTime / actionDuration) * 100;

    if (progress >= 100) {
        progress = 100; // Cap progress at 100%
        completeAction();
    }

    // Update the progress bar width
    if (progressBarElement) {
        progressBarElement.style.width = progress + "%";
    }

    // Continue updating the progress until it's complete
    if (progress < 100) {
        requestAnimationFrame(updateProgressBar);
    }
}

// Action is complete, reset and update the count
function completeAction() {
    currentAction = null;
    actionStartTime = null;
    actionDuration = 0;
    progress = 0;
    progressBarElement.style.width = "0%"; // Reset the progress bar

    // Update the count
    actionCountElement.textContent = parseInt(actionCountElement.textContent) + 1;

    // Reward the score and update display
    score += 10; // Adjust this value as per the action's reward
    updateDisplay();

    // Enable the button again
    actionButtonElement.disabled = false;
}

// Stop the current action (when a new action starts)
function stopAction() {
    currentAction = null;
    progress = 0;
    if (progressBarElement) {
        progressBarElement.style.width = "0%";
    }
    if (actionButtonElement) {
        actionButtonElement.disabled = false;
    }
}

// Update the display score
function updateDisplay() {
    scoreDisplay.textContent = score;
}

// Action event listeners
document.getElementById("seal-the-hull").addEventListener("click", function () {
    startAction("seal-the-hull", 5, 10, document.getElementById("seal-progress-bar"), this, document.getElementById("seal-count"));
});

document.getElementById("explore-the-system").addEventListener("click", function () {
    startAction("explore-the-system", 10, 20, document.getElementById("explore-progress-bar"), this, document.getElementById("explore-count"));
});

// Save and load game functionality
function saveGame() {
    const data = { score };
    localStorage.setItem("incrementalSave", JSON.stringify(data));
}

function loadGame() {
    const savedData = localStorage.getItem("incrementalSave");
    if (savedData) {
        const data = JSON.parse(savedData);
        score = data.score;
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
