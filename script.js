let score = 0;
let currentAction = null;
let progress = 0;
let actionStartTime = 0;
let actionDuration = 0;
let progressBarElement = null;
let actionButtonElement = null;
let actionCountElement = null;
let autosaveInterval; // Variable pour l'autosave

// Sauvegarder l'état actuel du jeu dans le localStorage
function saveGame() {
    const data = { score };
    localStorage.setItem("incrementalSave", JSON.stringify(data));
}

// Charger la sauvegarde depuis le localStorage
function loadGame() {
    const savedData = localStorage.getItem("incrementalSave");
    if (savedData) {
        const data = JSON.parse(savedData);
        score = data.score;
        updateDisplay();
    }
}

// Sauvegarder le jeu dans un fichier
function saveGameToFile() {
    const data = JSON.stringify({ score });
    const blob = new Blob([data], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "game_save.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Charger le jeu depuis un fichier
function loadGameFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.score !== undefined) {
                score = data.score;
                updateDisplay();
            } else {
                alert("Fichier de sauvegarde invalide.");
            }
        } catch {
            alert("Fichier de sauvegarde invalide.");
        }
    };
    reader.readAsText(file);
}

// Mettre à jour l'affichage du score
function updateDisplay() {
    document.getElementById("score").textContent = score;
}

// Démarrer l'action
function startAction(actionId, timeInSeconds, progressBar, button, countElement) {
    if (currentAction !== null) {
        stopAction(); // Arrêter l'action en cours
    }

    currentAction = actionId;
    actionStartTime = Date.now();
    actionDuration = timeInSeconds * 1000; // Conversion en millisecondes
    progress = 0;

    progressBarElement = progressBar;
    actionButtonElement = button;
    actionCountElement = countElement;

    button.disabled = true;
    requestAnimationFrame(updateProgressBar);
}

// Mise à jour de la barre de progression
function updateProgressBar() {
    const elapsedTime = Date.now() - actionStartTime;
    progress = (elapsedTime / actionDuration) * 100;

    if (progress >= 100) {
        progress = 100;
        completeAction();
    }

    if (progressBarElement) {
        progressBarElement.style.transform = `scaleY(${progress / 100})`;
    }

    if (progress < 100) {
        requestAnimationFrame(updateProgressBar);
    }
}

// Action terminée, mettre à jour et redémarrer l'action
function completeAction() {
    actionCountElement.textContent = parseInt(actionCountElement.textContent) + 1;
    score += 10;
    updateDisplay();
    restartAction();
}

// Redémarrer l'action
function restartAction() {
    setTimeout(function() {
        startAction(currentAction, actionDuration / 1000, progressBarElement, actionButtonElement, actionCountElement);
    }, 500);
}

// Arrêter l'action en cours
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

// Fonction de réinitialisation complète
function hardReset() {
    localStorage.removeItem("incrementalSave");
    score = 0;
    updateDisplay();
}

// Sauvegarde automatique toutes les 30 secondes
function startAutosave() {
    autosaveInterval = setInterval(saveGame, 30000);
}

// Arrêter la sauvegarde automatique
function stopAutosave() {
    clearInterval(autosaveInterval);
}

// Gestion des événements pour les boutons
document.getElementById("save-now").addEventListener("click", saveGame);
document.getElementById("save-file").addEventListener("click", saveGameToFile);
document.getElementById("file-input").addEventListener("change", loadGameFromFile);
document.getElementById("hard-reset").addEventListener("click", hardReset);

// Lancer l'autosave au démarrage
document.addEventListener("DOMContentLoaded", function () {
    loadGame();
    startAutosave();
    showPage("actions");
});

// Affichage des pages
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
}

// Démarrer les actions
document.getElementById("seal-the-hull").addEventListener("click", function () {
    startAction("seal-the-hull", 5, document.getElementById("seal-progress-bar"), this, document.getElementById("seal-count"));
});

document.getElementById("explore-the-system").addEventListener("click", function () {
    startAction("explore-the-system", 10, document.getElementById("explore-progress-bar"), this, document.getElementById("explore-count"));
});
