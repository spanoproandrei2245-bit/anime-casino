"use strict";
const authForm = document.getElementById('auth-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const switchModeBtn = document.getElementById('switch-mode');
const authTitle = document.getElementById('auth-title');
const switchText = document.getElementById('switch-text');
const authMessage = document.getElementById('auth-message');
let isLoginMode = true;
switchModeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    authTitle.textContent = isLoginMode ? 'Вхід' : 'Реєстрація';
    submitBtn.textContent = isLoginMode ? 'Увійти' : 'Створити акаунт';
    switchText.textContent = isLoginMode ? 'Ще немає акаунта?' : 'Вже маєте акаунт?';
    switchModeBtn.textContent = isLoginMode ? 'Зареєструватися' : 'Увійти';
    authMessage.textContent = '';
});
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    const endpoint = isLoginMode ? '/api/login' : '/api/register';
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (!response.ok) {
            authMessage.style.color = '#ff3333';
            authMessage.textContent = data.error || 'Помилка';
            return;
        }
        authMessage.style.color = '#00ff00';
        if (isLoginMode && data.token) {
            authMessage.textContent = 'Успішний вхід! Завантаження...';
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('balance', data.balance);
            setTimeout(() => { window.location.href = 'index.html'; }, 1000);
        }
        else {
            authMessage.textContent = data.message || 'Реєстрація успішна!';
            setTimeout(() => {
                switchModeBtn.click();
                passwordInput.value = '';
            }, 1500);
        }
    }
    catch (err) {
        authMessage.style.color = '#ff3333';
        authMessage.textContent = 'Помилка з\'єднання з сервером';
    }
});
