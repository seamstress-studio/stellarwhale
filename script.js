let score = 0;
let actionSpeed = 1000; // Base speed: 1 second for full action
let speedUpgradeCost = 100;
let upgradesPurchased = 0;

const scoreDisplay = document.getElementById("score");

// Action states to track progress
let actionInProgress = {
    sealTheHull: { progress: 0, interval: null },
    exploreTheSystem: { progress: 0, interval: null }
};

function updateDisplay() {
    scoreDisplay.textContent = score;
}

function startAction(actionId, actionTime, reward) {
    // Stop other action if it's running
    if (actionInProgress.sealTheHull.interval) stopAction("sealTheHull");
    if (actionInProgress.exploreTheSystem.interval) stopAction("exploreTheSystem");

    const progressBar = document.getElementById(actionId + "-progress-bar");
    const count = document.getElementById(actionId + "-count");
    const button = document.getElementById(actionId);

    let progress = 0;
    button.disabled = true; // Disable the button

    actionInProgress[actionId].interval = setInterval(() => {
        progress += 100 / actionTime;
        progressBar.style.width = progress + "%"; // Update progress bar

        if (progress >= 100) {
            clearInterval(actionInProgress[actionId].interval);
            actionInProgress[actionId].interval = null;
            count.textContent = parseInt(count.textContent) + 1; // Increment count
            score += reward; // Add reward to score
            updateDisplay();
            button.disabled = false; // Enable button
            progressBar.style.width = "0"; // Reset progress bar
        }
    }, actionSpeed); // Set action duration
}

function stopAction(actionId) {
    // Stop action and store progress
    clearInterval(actionInProgress[actionId].interval);
    actionInProgress[actionId].interval = null;
}

// Action event listeners
document.getElementById("seal-the-hull").addEventListener("click", function() {
    startAction("seal-the-hull", 50, 10); // Seal the Hull: 5 seconds, reward 10 points
});

document.getElementById("explore-the-system").addEventListener("click", function() {
    startAction("explore-the-system", 100, 20); // Explore the System: 10 seconds, reward 20 points
});

// Speed upgrade
document.getElementById("buy-speed-upgrade").addEventListener("click", function() {
    if (score >= speedUpgradeCost) {
        score -= speedUpgradeCost;
        upgradesPurchased++;
        actionSpeed -= 100; // Decrease action time by 100 ms (speed up actions)
        speedUpgradeCost += 100; // Increase upgrade cost for the next upgrade
        updateDisplay();
        alert("Speed upgrade purchased!");
    } else {
        alert("Not enough points for the upgrade.");
    }
});

// Save and load game functionality
function saveGame() {
    const data = { score, actionSpeed, upgradesPurchased };
    localStorage.setItem("incrementalSave", JSON.stringify(data));
}

function loadGame() {
    const savedData = localStorage.getItem("incrementalSave");
    if (savedData) {
        const data = JSON.parse(savedData);
        score = data.score;
        actionSpeed = data.actionSpeed;
        upgradesPurchased = data.upgradesPurchased;
        updateDisplay();
    }
}

document.getElementById("save-now").addEventListener("click", saveGame);
document.getElementById("load-file").addEventListener("click", function() {
    loadGame();
});

document.addEventListener("DOMContentLoaded", function() {
    loadGame();
    showPage("actions");
});

// Show page function
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
}
