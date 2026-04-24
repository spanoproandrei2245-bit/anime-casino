document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;

    try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();

        if (data.success && data.leaderboard) {
            tbody.innerHTML = '';
            data.leaderboard.forEach((player: any, index: number) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#${index + 1}</td>
                    <td style="font-weight: bold; color: #fff;">${player.username}</td>
                    <td style="color: #deff9a;">${player.balance} 💎</td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Помилка завантаження</td></tr>';
    }
});