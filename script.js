let score = 0;
let currentAction = null; // Track the current action in progress
let progress = 0; // Track the progress of the current action
let actionStartTime = 0; // Start time of the current action
let actionDuration = 0; // Duration of the current action
let progressBarElement = null; // Element for the progress bar
let actionButtonElement = null; // Element for the action button
let actionCountElement = null; // Element for the count of completed actions

// Start action function
function startAction(actionId, timeInSeconds, progressBar, button, countElement) {
    if (currentAction !== null) {
        stopAction(); // Stop any current action before starting a new one
    }

    // Set the new action parameters
    currentAction = actionId;
    actionStartTime = Date.now();
    actionDuration = timeInSeconds * 1000; // Convert seconds to milliseconds
    progress = 0; // Reset progress

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
        completeAction(); // Action completed, handle completion
    }

    // Update the progress bar height inside the button
    if (progressBarElement) {
        progressBarElement.style.transform = `scaleY(${progress / 100})`; // Scale the height based on progress
    }

    // Continue updating the progress until it's complete
    if (progress < 100) {
        requestAnimationFrame(updateProgressBar);
    }
}

// Action is complete, increment the count and reset the action
function completeAction() {
    // Increment the action count
    actionCountElement.textContent = parseInt(actionCountElement.textContent) + 1;

    // Reward the score and update display
    score += 10; // You can adjust this value based on the action
    updateDisplay();

    // Action has completed, so reset progress and restart the action
    restartAction();
}

// Restart the action once it's complete
function restartAction() {
    // Set a small delay before restarting (optional)
    setTimeout(function() {
        startAction(currentAction, actionDuration / 1000, progressBarElement, actionButtonElement, actionCountElement);
    }, 500); // Restart after 500ms delay for a smoother transition
}

// Stop the current action
function stopAction() {
    currentAction = null;
    progress = 0;
    if (progressBarElement) {
        progressBarElement.style.width = "0%"; // Reset progress bar
    }
    if (actionButtonElement) {
        actionButtonElement.disabled = false;
    }
}

// Update the score display
function updateDisplay() {
    document.getElementById("score").textContent = score;
}

// Action event listeners
document.getElementById("seal-the-hull").addEventListener("click", function () {
    startAction("seal-the-hull", 5, document.getElementById("seal-progress-bar"), this, document.getElementById("seal-count"));
});

document.getElementById("explore-the-system").addEventListener("click", function () {
    startAction("explore-the-system", 10, document.getElementById("explore-progress-bar"), this, document.getElementById("explore-count"));
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
