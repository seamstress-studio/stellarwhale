let score = 0;
let actionSpeed = 1000; // 1000 ms = 1 seconde de base
let speedUpgradeCost = 100;
let upgradesPurchased = 0;

const scoreDisplay = document.getElementById("score");

// Met à jour l'affichage du score
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
        progress += 100 / actionTime;
        button.style.background = `linear-gradient(to right, #4caf50 ${progress}%, #f3f3f3 ${progress}%)`; // Remplissage progressif

        if (progress >= 100) {
            clearInterval(interval);
            count.textContent = parseInt(count.textContent) + 1; // Augmente le nombre
            score += reward; // Récompense
            updateDisplay();
            button.style.background = ""; // Réinitialise la couleur
            button.disabled = false; // Réactive le bouton
        }
    }, actionSpeed); // Utilise actionSpeed pour la vitesse de progression
}

// Ajout des écouteurs d'événements aux boutons d'actions
document.getElementById("seal-the-hull").addEventListener("click", function() {
    startAction("seal-the-hull", "seal-count", 50, 10); // 5 secondes, récompense 10 points
});

document.getElementById("explore-the-system").addEventListener("click", function() {
    startAction("explore-the-system", "explore-count", 100, 20); // 10 secondes, récompense 20 points
});

// Acheter une amélioration de vitesse
document.getElementById("buy-speed-upgrade").addEventListener("click", function() {
    if (score >= speedUpgradeCost) {
        score -= speedUpgradeCost;
        upgradesPurchased++;
        actionSpeed -= 100; // Réduit la durée de l'action de 100ms (accélère les actions)
        speedUpgradeCost += 100; // Augmente le coût de la prochaine amélioration
        updateDisplay();
        alert("Amélioration de vitesse achetée !");
    } else {
        alert("Pas assez de points pour acheter cette amélioration.");
    }
});

// Sauvegarde, chargement et autres mécanismes
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

// Fonction pour changer les pages
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });
    document.getElementById(pageId).style.display = "block";
}
