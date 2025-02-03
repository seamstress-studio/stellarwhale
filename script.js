let score = 0;

const scoreDisplay = document.getElementById("score");

// Fonction pour mettre à jour l'affichage du score
function updateDisplay() {
    scoreDisplay.textContent = score;
}

// Fonction de progression de l'action
function startAction(buttonId, countId, actionTime, reward) {
    const button = document.getElementById(buttonId);
    const count = document.getElementById(countId);

    let progress = 0;
    button.disabled = true; // Désactive le bouton pendant l'action

    const interval = setInterval(() => {
        progress += 100 / actionTime; // On ajoute 100% du progrès en fonction du temps
        button.style.background = `linear-gradient(to right, #4caf50 ${progress}%, #f3f3f3 ${progress}%)`; // Remplissage progressif du bouton
        
        if (progress >= 100) {
            clearInterval(interval);
            count.textContent = parseInt(count.textContent) + 1; // Augmente le nombre
            score += reward; // Récompense après l'action
            updateDisplay();
            button.style.background = ""; // Réinitialise la couleur du bouton
            button.disabled = false; // Réactive le bouton
        }
    }, 100); // Intervalle de 100 ms pour la progression
}

// Ajout des écouteurs d'événements aux boutons
document.getElementById("seal-the-hull").addEventListener("click", function() {
    startAction("seal-the-hull", "seal-count", 50, 10); // 5 secondes, récompense 10 points
});

document.getElementById("explore-the-system").addEventListener("click", function() {
    startAction("explore-the-system", "explore-count", 100, 20); // 10 secondes, récompense 20 points
});

// Sauvegarde, chargement et autres mécanismes que tu avais déjà
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
document.getElementById("load-file").addEventListener("click", function() {
    loadGame();
});

document.addEventListener("DOMContentLoaded", function() {
    loadGame();
    showPage("actions");
});

// Fonction pour changer les pages
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
}
