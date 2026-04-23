const depBtn = document.getElementById('deposit-btn') as HTMLButtonElement;
const spinBtn = document.getElementById('spin-btn') as HTMLButtonElement;
const betInput = document.getElementById('bet-amount') as HTMLInputElement;
const messageEl = document.getElementById('message') as HTMLDivElement;
const slot1 = document.getElementById('slot1') as HTMLElement;
const slot2 = document.getElementById('slot2') as HTMLElement;
const slot3 = document.getElementById('slot3') as HTMLElement;
const balanceEl = document.getElementById('balance') as HTMLSpanElement;

const currentBalance = localStorage.getItem('balance') || '1000';
if (balanceEl) balanceEl.textContent = currentBalance;

function updateHUD(newBalance: number) {
    const hudVal = document.getElementById('hud-balance-val');
    if (hudVal) hudVal.textContent = newBalance.toString();
    if (balanceEl) balanceEl.textContent = newBalance.toString();
    localStorage.setItem('balance', newBalance.toString());
}

spinBtn.addEventListener('click', async () => {
    const bet = betInput.value;
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Пожалуйста, войдите в аккаунт!");
        window.location.href = 'auth.html';
        return;
    }

    spinBtn.disabled = true;
    messageEl.textContent = "Крутим...";
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

        const data: any = await res.json();
        clearInterval(spinInterval);

        if (!res.ok) {
            messageEl.textContent = data.error || "Ошибка сервера";
            messageEl.className = "message lose-text";
            spinBtn.disabled = false;
            return;
        }

        slot1.textContent = data.result[0];
        slot2.textContent = data.result[1];
        slot3.textContent = data.result[2];

        updateHUD(data.newBalance);

        if (data.winAmount > 0) {
            messageEl.textContent = `Джекпот! Выигрыш: ${data.winAmount} 💎`;
            messageEl.className = "message win-text";
        } else {
            messageEl.textContent = "Не повезло. Попробуй еще!";
            messageEl.className = "message lose-text";
        }
    } catch (err) {
        clearInterval(spinInterval);
        messageEl.textContent = "Ошибка соединения";
    }
    
    spinBtn.disabled = false;
});

if (depBtn) {
    depBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const isSure = confirm("Береш безкоштовні 500 монет?");
        if (!isSure) return;

        depBtn.disabled = true;

        try {
            const res = await fetch('/api/deposit', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            const data: any = await res.json();

            if (!res.ok) {
                messageEl.textContent = data.error || "Помилка поповнення";
                messageEl.className = "message lose-text";
            } else {
                updateHUD(data.newBalance);
                messageEl.textContent = "Баланс поповнено на 500! 💸";
                messageEl.className = "message win-text";
            }
        } catch (err) {
            messageEl.textContent = "Помилка з'єднання";
        }

        depBtn.disabled = false;
    });
}

const quickBetBtns = document.querySelectorAll('.quick-bets .quick-btn');

quickBetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const amountToAdd = Number(btn.getAttribute('data-add'));
        
        if (amountToAdd && betInput) {
            const currentBet = Number(betInput.value) || 0;
            betInput.value = (currentBet + amountToAdd).toString();
        }
    });
});