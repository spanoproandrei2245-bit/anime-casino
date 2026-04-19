const spinBtn = document.getElementById('spin-btn');
const depBtn = document.getElementById('deposit-btn');
const betInput = document.getElementById('bet-amount');
const balanceEl = document.getElementById('balance');
const messageEl = document.getElementById('message');
const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const dialogue = document.getElementById('character-dialogue');
const quickBtns = document.querySelectorAll('.quick-btn');

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/balance');
        const data = await res.json();
        balanceEl.textContent = data.balance;
    } catch (e) { 
        balanceEl.textContent = "Помилка";
    }
});

depBtn.addEventListener('click', async () => {
    const isSure = confirm("Ви впевнені, що хочете взяти безкоштовні 500 монет?");
    
    if (isSure) {
        try {
            const res = await fetch('/api/deposit', { method: 'POST' });
            const data = await res.json();
            
            balanceEl.textContent = data.newBalance;
            messageEl.textContent = "Баланс поповнено на 500!";
            messageEl.className = "message win-text";
            dialogue.textContent = "Ого, ти повернувся у гру! 💖";
        } catch (e) { 
            messageEl.textContent = "Помилка поповнення!"; 
            messageEl.className = "message lose-text";
        }
    }
});

quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const addValue = parseInt(btn.getAttribute('data-add'));
        const currentBet = parseInt(betInput.value) || 0;
        betInput.value = currentBet + addValue;
    });
});

spinBtn.addEventListener('click', async () => {
    const bet = parseInt(betInput.value);

    spinBtn.disabled = true;
    messageEl.textContent = "Крутимо...";
    messageEl.className = "message";

    try {
        const response = await fetch('/api/spin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bet })
        });

        const data = await response.json();

        if (!response.ok) {
            messageEl.textContent = data.error;
            messageEl.className = "message lose-text";
            spinBtn.disabled = false;
            return;
        }

        let counter = 0;
        const interval = setInterval(() => {
            const emojis = ['🍒', '💎', '🔔', '7️⃣'];
            slot1.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            slot2.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            slot3.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            counter++;
            
            if (counter > 10) {
                clearInterval(interval);
                
                slot1.textContent = data.result[0];
                slot2.textContent = data.result[1];
                slot3.textContent = data.result[2];
                balanceEl.textContent = data.newBalance;

                if (data.win > 0) {
                    messageEl.textContent = `ДЖЕКПОТ! Виграш: ${data.win}`;
                    messageEl.className = "message win-text";
                    dialogue.textContent = "Вау! Ти неймовірний!";
                } else {
                    messageEl.textContent = "Програш. Спробуй ще!";
                    messageEl.className = "message lose-text";
                    dialogue.textContent = "Ой... Наступного разу пощастить більше!";
                }
                spinBtn.disabled = false;
            }
        }, 50);

    } catch (err) {
        messageEl.textContent = "Помилка зв'язку з сервером";
        messageEl.className = "message lose-text";
        spinBtn.disabled = false;
    }
});