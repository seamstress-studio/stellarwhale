let score = 0;
let ticks = 0; // Le nombre de ticks disponibles

const scoreDisplay = document.getElementById("score");
const tickCountDisplay = document.getElementById("tick-count");

// Fonction pour mettre à jour l'affichage du score et des ticks
function updateDisplay() {
    scoreDisplay.textContent = score;
    tickCountDisplay.textContent = ticks;
}

// Fonction de progression de l'action
function startAction(buttonId, countId, actionTime, cost, reward) {
    const button = document.getElementById(buttonId);
    const count = document.getElementById(countId);

    if (ticks < cost) {
        alert("Pas assez de ticks !");
        return;
    }

    ticks -= cost; // Déduit les ticks nécessaires
    updateDisplay();
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 100 / actionTime; // On ajoute 100% du progrès en fonction du temps
        button.style.background = `linear-gradient(to right, #4caf50 ${progress}%, #f3f3f3 ${progress}%)`; // Remplissage progressif du bouton
        
        if (progress >= 100) {
            clearInterval(interval);
            count.textContent = parseInt(count.textContent) + 1; // Augmente le nombre
            score += reward; // Récompense après l'action
            updateDisplay();
            button.style.background = ""; // Réinitialise la couleur du bouton
        }
    }, 100); // Intervalle de 100 ms pour la progression
}

// Ajout des écouteurs d'événements aux boutons
document.getElementById("seal-the-hull").addEventListener("click", function() {
    startAction("seal-the-hull", "seal-count", 5000, 50, 10); // 5 secondes, coût 50 ticks, récompense 10 points
});

document.getElementById("explore-the-system").addEventListener("click", function() {
    startAction("explore-the-system", "explore-count", 10000, 100, 20); // 10 secondes, coût 100 ticks, récompense 20 points
});

// Timer : Ajoute 10 ticks toutes les 100 ms (10 ticks par seconde)
setInterval(function() {
    ticks += 10; // Ajoute 10 ticks par seconde
    updateDisplay();
}, 100); // 100 ms = 10 ticks par seconde

// Sauvegarde, chargement et autres mécanismes que tu avais déjà
function saveGame() {
    const data = { score, ticks };
    localStorage.setItem("incrementalSave", JSON.stringify(data));
}

function loadGame() {
    const savedData = localStorage.getItem("incrementalSave");
    if (savedData) {
        const data = JSON.parse(savedData);
        score = data.score;
        ticks = data.ticks;
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
