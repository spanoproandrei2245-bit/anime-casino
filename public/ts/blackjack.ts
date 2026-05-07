(() => {
    const playBtn = document.getElementById('play-btn') as HTMLButtonElement;
    const betInput = document.getElementById('bet-amount') as HTMLInputElement;
    const messageEl = document.getElementById('message') as HTMLDivElement;
    const playerScoreEl = document.getElementById('player-score') as HTMLElement;
    const dealerScoreEl = document.getElementById('dealer-score') as HTMLElement;
    const balanceEl = document.getElementById('balance') as HTMLSpanElement;
    const depBtn = document.getElementById('deposit-btn') as HTMLButtonElement;

    const currentBalance = localStorage.getItem('balance') || '1000';
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

    // Робочі кнопки швидких ставок
    const quickBetBtns = document.querySelectorAll('.bj-quick-bet');
    quickBetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const amount = parseInt((btn as HTMLButtonElement).dataset.amount || '0');
            const currentBet = parseInt(betInput.value || '0');
            betInput.value = (currentBet + amount).toString();
        });
    });

    playBtn.addEventListener('click', async () => {
        const bet = betInput.value;
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = 'auth.html';
            return;
        }

        playBtn.disabled = true;
        messageEl.textContent = "Роздаємо карти...";
        messageEl.className = "message";
        playerScoreEl.textContent = "🎲";
        dealerScoreEl.textContent = "🎲";

        try {
            const res = await fetch('/api/blackjack', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ bet })
            });

            const data: any = await res.json();

            if (!res.ok) {
                messageEl.textContent = data.error || "Помилка сервера";
                messageEl.className = "message lose-text";
                playBtn.disabled = false;
                return;
            }

            playerScoreEl.textContent = data.playerScore.toString();
            dealerScoreEl.textContent = data.dealerScore.toString();
            
            playerScoreEl.classList.add('score-anim');
            dealerScoreEl.classList.add('score-anim');
            
            setTimeout(() => {
                playerScoreEl.classList.remove('score-anim');
                dealerScoreEl.classList.remove('score-anim');
            }, 300);

            updateHUD(data.newBalance);

            messageEl.textContent = data.message;
            if (data.winAmount > 0) {
                messageEl.className = "message win-text";
            } else if (data.winAmount === 0 && data.message.includes('Нічия')) {
                messageEl.className = "message";
            } else {
                messageEl.className = "message lose-text";
            }
        } catch (err) {
            messageEl.textContent = "Помилка з'єднання";
        }
        
        playBtn.disabled = false;
    });

    document.getElementById('logout-btn')?.addEventListener('click', () => {
        localStorage.clear(); 
        window.location.href = 'auth.html';
    });

    if (depBtn) {
        depBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

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
})();