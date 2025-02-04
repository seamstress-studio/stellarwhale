function showPage(page) {
    document.querySelectorAll('.container').forEach(el => el.classList.remove('active'));
    document.getElementById(page).classList.add('active');
}

function startAction(action) {
    if (action === 'combat') {
        let progress = document.getElementById('combat-bar');
        progress.style.width = '0%';
        let width = 0;
        let interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                document.getElementById('kills').innerText = parseInt(document.getElementById('kills').innerText) + 1;
                startAction('combat'); // Continue combat automatically
            } else {
                width += 10;
                progress.style.width = width + '%';
            }
        }, 500);
    }
}

function saveGame() {
    localStorage.setItem('kills', document.getElementById('kills').innerText);
    localStorage.setItem('charName', document.getElementById('char-name').value);
    localStorage.setItem('shipName', document.getElementById('ship-name').value);
    alert('Game Saved!');
}

function loadGame() {
    document.getElementById('kills').innerText = localStorage.getItem('kills') || 0;
    document.getElementById('char-name').value = localStorage.getItem('charName') || 'Hero';
    document.getElementById('ship-name').value = localStorage.getItem('shipName') || 'Star Explorer';
    alert('Game Loaded!');
}
