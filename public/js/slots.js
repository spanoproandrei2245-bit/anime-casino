"use strict";
(() => {
    const spinBtn = document.getElementById('spin-btn');
    const betInput = document.getElementById('bet-amount');
    const messageEl = document.getElementById('message');
    const balanceEl = document.getElementById('balance');
    const depBtn = document.getElementById('deposit-btn');
    const slots = [
        document.getElementById('slot1'),
        document.getElementById('slot2'),
        document.getElementById('slot3')
    ];
    const currentBalance = localStorage.getItem('balance') || '1000';
    if (balanceEl)
        balanceEl.textContent = currentBalance;
    const hudUsername = document.getElementById('hud-username');
    if (hudUsername)
        hudUsername.textContent = localStorage.getItem('username') || 'Гравець';
    const hudBalance = document.getElementById('hud-balance-val');
    if (hudBalance)
        hudBalance.textContent = currentBalance;
    function updateHUD(newBalance) {
        if (hudBalance)
            hudBalance.textContent = newBalance.toString();
        if (balanceEl)
            balanceEl.textContent = newBalance.toString();
        localStorage.setItem('balance', newBalance.toString());
    }
    // Робочі кнопки швидких ставок
    const quickBetBtns = document.querySelectorAll('.bj-quick-bet');
    quickBetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const amount = parseInt(btn.dataset.amount || '0');
            const currentBet = parseInt(betInput.value || '0');
            betInput.value = (currentBet + amount).toString();
        });
    });
    // Логіка Додепу
    if (depBtn) {
        depBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            if (!token)
                return;
            if (!confirm("Береш безкоштовні 500 монет?"))
                return;
            try {
                const res = await fetch('/api/deposit', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    updateHUD(data.newBalance);
                    messageEl.textContent = "Баланс поповнено! 💸";
                    messageEl.className = "message win-text";
                }
            }
            catch (err) {
                console.error("Помилка додепу");
            }
        });
    }
    spinBtn.addEventListener('click', async () => {
        const bet = betInput.value;
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'auth.html';
            return;
        }
        spinBtn.disabled = true;
        messageEl.textContent = "Крутимо...";
        messageEl.className = "message";
        let spinInterval = setInterval(() => {
            const symbols = ['🍒', '💎', '🔔', '7️⃣'];
            slots.forEach(slot => {
                slot.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            });
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
            slots[0].textContent = data.result[0];
            slots[1].textContent = data.result[1];
            slots[2].textContent = data.result[2];
            updateHUD(data.newBalance);
            if (data.winAmount > 0) {
                messageEl.textContent = `Ти виграв ${data.winAmount} 💎!`;
                messageEl.className = "message win-text";
            }
            else {
                messageEl.textContent = "Не повезло. Попробуй еще!";
                messageEl.className = "message lose-text";
            }
        }
        catch (err) {
            clearInterval(spinInterval);
            messageEl.textContent = "Помилка з'єднання";
        }
        spinBtn.disabled = false;
    });
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'auth.html';
    });
})();
