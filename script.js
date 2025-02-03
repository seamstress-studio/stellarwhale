let score = 0;
let currentAction = null;
let progress = 0;
let actionStartTime = 0;
let actionDuration = 0;
let progressBarElement = null;
let actionButtonElement = null;
let actionCountElement = null;
let savedProgress = {};  // Object to store saved progress for each action
let isActionInProgress = false;

// Sauvegarde de l'état du jeu dans le localStorage
function saveGame() {
    const gameState = {
        score,
        currentAction,
        progress,
        savedProgress
    };
    localStorage.setItem("incrementalSave", JSON.stringify(gameState));
}

// Chargement de l'état du jeu depuis le localStorage
function loadGame() {
    const savedData = localStorage.getItem("incrementalSave");
    if (savedData) {
        const data = JSON.parse(savedData);
        score = data.score;
        currentAction = data.currentAction;
        progress = data.progress;
        savedProgress = data.savedProgress;
        updateDisplay();
        if (currentAction) {
            // Restaurer l'état de l'action en cours
            const action = document.getElementById(currentAction);
            startAction(currentAction, actionDuration / 1000, progressBarElement, action, actionCountElement);
        }
    }
}

// Fonction pour démarrer une action avec la barre de progression
function startAction(actionId, timeInSeconds, progressBar, button, countElement) {
    // Si une action est en cours, sauvegardons son état actuel avant de commencer la nouvelle
    if (currentAction !== null && isActionInProgress) {
        savedProgress[currentAction] = progress;  // Sauvegarder la progression actuelle de l'action en cours
        stopAction();  // Arrêter l'action en cours avant d'en commencer une nouvelle
    }

    currentAction = actionId;
    actionStartTime = Date.now();
    actionDuration = timeInSeconds * 1000;  // Conversion en millisecondes
    progress = savedProgress[actionId] || 0;  // Restaurer la progression sauvegardée ou commencer à 0

    progressBarElement = progressBar;
    actionButtonElement = button;
    actionCountElement = countElement;
    isActionInProgress = true;

    // Remise à zéro de la barre de progression avant le début si c'est une nouvelle action
    progressBarElement.style.width = `${progress}%`;
    button.disabled = true;
    requestAnimationFrame(updateProgressBar);  // Commencer à remplir la barre
}

// Mise à jour de la barre de progression
function updateProgressBar() {
    const elapsedTime = Date.now() - actionStartTime;
    progress = (elapsedTime / actionDuration) * 100;  // Calcul du pourcentage

    if (progress >= 100) {
        progress = 100;
        completeAction();  // Terminer l'action si la barre est pleine
    }

    if (progressBarElement) {
        progressBarElement.style.width = `${progress}%`;  // Mise à jour de la largeur de la barre
    }

    if (progress < 100) {
        requestAnimationFrame(updateProgressBar);  // Continuer à mettre à jour tant que l'action n'est pas terminée
    }
}

// Action terminée, mise à jour et redémarrage
function completeAction() {
    actionCountElement.textContent = parseInt(actionCountElement.textContent) + 1;
    score += 10;  // Ajouter un score lorsque l'action est terminée
    updateDisplay();
    restartAction();  // Redémarrer l'action après une courte pause
}

// Redémarrer l'action après un délai
function restartAction() {
    setTimeout(function() {
        startAction(currentAction, actionDuration / 1000, progressBarElement, actionButtonElement, actionCountElement);
    }, 500);  // Délai de 500ms avant de recommencer
}

// Arrêter l'action en cours
function stopAction() {
    currentAction = null;
    progress = 0;
    isActionInProgress = false;
    if (progressBarElement) {
        progressBarElement.style.width = "0%";  // Réinitialiser la barre
    }
    if (actionButtonElement) {
        actionButtonElement.disabled = false;  // Réactiver le bouton
    }
}

// Mettre à jour l'affichage du score
function updateDisplay() {
    document.getElementById("score").textContent = score;
}

// Gestion des événements pour les boutons
document.getElementById("seal-the-hull").addEventListener("click", function () {
    startAction("seal-the-hull", 5, document.getElementById("seal-progress-bar"), this, document.getElementById("seal-count"));
});

document.getElementById("explore-the-system").addEventListener("click", function () {
    startAction("explore-the-system", 10, document.getElementById("explore-progress-bar"), this, document.getElementById("explore-count"));
});

// Sauvegarde toutes les 30 secondes
setInterval(saveGame, 30000);  // Sauvegarde automatique

// Chargement du jeu au démarrage
document.addEventListener("DOMContentLoaded", function () {
    loadGame();
});
