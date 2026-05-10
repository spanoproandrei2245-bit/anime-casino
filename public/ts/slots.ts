(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    const spinBtn = document.getElementById('spin-btn') as HTMLButtonElement;
    const betInput = document.getElementById('bet-amount') as HTMLInputElement;
    const messageEl = document.getElementById('message') as HTMLDivElement;
    const balanceEl = document.getElementById('balance') as HTMLSpanElement;
    const depBtn = document.getElementById('deposit-btn') as HTMLButtonElement;

    const slots = [
        document.getElementById('slot1') as HTMLDivElement,
        document.getElementById('slot2') as HTMLDivElement,
        document.getElementById('slot3') as HTMLDivElement
    ];

    const currentBalance = localStorage.getItem('balance') || '0';
    if (balanceEl) balanceEl.textContent = currentBalance;
    
    const hudUsername = document.getElementById('hud-username');
    if (hudUsername) hudUsername.textContent = localStorage.getItem('username') || 'Гравець';
    
    const hudBalance = document.getElementById('hud-balance-val');
    if (hudBalance) hudBalance.textContent = currentBalance;

    function updateHUD(newBalance: number) {
        if (hudBalance) hudBalance.textContent = newBalance.toString();
        if (balanceEl) balanceEl.textContent = newBalance.toString();
        localStorage.setItem('balance', newBalance.toString());
    }

    const quickBetBtns = document.querySelectorAll('.bj-quick-bet');
    quickBetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const amount = parseInt((btn as HTMLButtonElement).dataset.amount || '0');
            const currentBet = parseInt(betInput.value || '0');
            betInput.value = (currentBet + amount).toString();
        });
    });

    if (depBtn) {
        depBtn.addEventListener('click', async () => {
            if (!confirm("Береш безкоштовні 500 монет?")) return;

            try {
                const res = await fetch('/api/deposit', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data: any = await res.json();
                if (res.ok) {
                    updateHUD(data.newBalance);
                    messageEl.textContent = "Баланс поповнено! 💸";
                    messageEl.className = "message win-text";
                }
            } catch (err) {
                console.error("Помилка додепу");
            }
        });
    }

    spinBtn.addEventListener('click', async () => {
        const bet = betInput.value;

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

            const data: any = await res.json();
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
                messageEl.textContent = `Ти виграв ${data.winAmount} 💸!`;
                messageEl.className = "message win-text";
            } else {
                messageEl.textContent = "Не повезло. Попробуй ще!";
                messageEl.className = "message lose-text";
            }
        } catch (err) {
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