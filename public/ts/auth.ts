(() => {
    const authMainTitle = document.getElementById('auth-main-title') as HTMLHeadingElement;
    
    const loginForm = document.getElementById('login-form') as HTMLDivElement;
    const registerForm = document.getElementById('register-form') as HTMLDivElement;
    
    const showRegisterLink = document.getElementById('show-register') as HTMLAnchorElement;
    const showLoginLink = document.getElementById('show-login') as HTMLAnchorElement;

    const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
    const registerBtn = document.getElementById('register-btn') as HTMLButtonElement;

    const loginUsernameInput = document.getElementById('login-username') as HTMLInputElement;
    const loginPasswordInput = document.getElementById('login-password') as HTMLInputElement;
    
    const regUsernameInput = document.getElementById('reg-username') as HTMLInputElement;
    const regPasswordInput = document.getElementById('reg-password') as HTMLInputElement;

    const loginMessage = document.getElementById('login-message') as HTMLDivElement;
    const registerMessage = document.getElementById('register-message') as HTMLDivElement;

    if (showRegisterLink && showLoginLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'flex';
            loginMessage.textContent = '';
            if (authMainTitle) authMainTitle.textContent = 'РЕЄСТРАЦІЯ';
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginForm.style.display = 'flex';
            registerMessage.textContent = '';
            if (authMainTitle) authMainTitle.textContent = 'ВХІД';
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const username = loginUsernameInput.value.trim();
            const password = loginPasswordInput.value.trim();

            if (!username || !password) {
                loginMessage.textContent = 'Введіть нікнейм та пароль!';
                loginMessage.className = 'auth-message lose-text';
                return;
            }

            loginBtn.disabled = true;

            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('balance', data.balance);
                    window.location.href = 'index.html';
                } else {
                    loginMessage.textContent = data.error || 'Помилка входу';
                    loginMessage.className = 'auth-message lose-text';
                }
            } catch (err) {
                loginMessage.textContent = 'Помилка з\'єднання з сервером';
                loginMessage.className = 'auth-message lose-text';
            }
            
            loginBtn.disabled = false;
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', async () => {
            const username = regUsernameInput.value.trim();
            const password = regPasswordInput.value.trim();

            if (!username || !password) {
                registerMessage.textContent = 'Введіть нікнейм та пароль!';
                registerMessage.className = 'auth-message lose-text';
                return;
            }

            registerBtn.disabled = true;

            try {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();

                if (res.ok) {
                    registerMessage.textContent = 'Успішно! Тепер увійдіть.';
                    registerMessage.className = 'auth-message win-text';
                    setTimeout(() => {
                        showLoginLink.click();
                        loginUsernameInput.value = username; 
                        regUsernameInput.value = '';
                        regPasswordInput.value = '';
                    }, 1500);
                } else {
                    registerMessage.textContent = data.error || 'Помилка реєстрації';
                    registerMessage.className = 'auth-message lose-text';
                }
            } catch (err) {
                registerMessage.textContent = 'Помилка з\'єднання з сервером';
                registerMessage.className = 'auth-message lose-text';
            }
            
            registerBtn.disabled = false;
        });
    }
})();