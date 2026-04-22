"use strict";
const spinBtn = document.getElementById('spin-btn');
const betInput = document.getElementById('bet-amount');
const messageEl = document.getElementById('message');
const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
function updateHUD(newBalance) {
    const hudVal = document.getElementById('hud-balance-val');
    if (hudVal) {
        hudVal.textContent = newBalance.toString();
    }
    localStorage.setItem('balance', newBalance.toString());
}
spinBtn.addEventListener('click', async () => {
    const bet = betInput.value;
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Будь ласка, увійдіть в акаунт!");
        window.location.href = 'auth.html';
        return;
    }
    spinBtn.disabled = true;
    messageEl.textContent = "Крутимо...";
    messageEl.className = "message";
    let spinInterval = setInterval(() => {
        const symbols = ['🍒', '💎', '🔔', '7️⃣'];
        slot1.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        slot2.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        slot3.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    }, 100);
    try {
        const res = await fetch('/api/spin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ bet })
        });
        const data = await res.json();
        clearInterval(spinInterval);
        if (!res.ok) {
            messageEl.textContent = data.error || "Помилка сервера";
            messageEl.className = "message lose-text";
            spinBtn.disabled = false;
            return;
        }
        slot1.textContent = data.result[0];
        slot2.textContent = data.result[1];
        slot3.textContent = data.result[2];
        updateHUD(data.newBalance);
        if (data.winAmount > 0) {
            messageEl.textContent = `Джекпот! Виграш: ${data.winAmount} 💎`;
            messageEl.className = "message win-text";
        }
        else {
            messageEl.textContent = "Не пощастило. Спробуй ще!";
            messageEl.className = "message lose-text";
        }
    }
    catch (err) {
        clearInterval(spinInterval);
        messageEl.textContent = "Помилка з'єднання";
    }
    spinBtn.disabled = false;
});
