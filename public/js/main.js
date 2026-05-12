document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to dashboard
    if (localStorage.getItem('token')) {
        window.location.href = 'http://localhost:5173/dashboard';
    }

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorEl = document.getElementById('loginError');

            try {
                const res = await api.post('/auth/login', { email, password });
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                const token = res.data.token;
                const user = encodeURIComponent(JSON.stringify(res.data.user));
                const host = window.location.hostname;
                window.location.href = `http://${host}:5173/dashboard?token=${token}&user=${user}`;
            } catch (error) {
                errorEl.textContent = error.message;
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const referralCode = document.getElementById('registerRefCode').value;
            
            const errorEl = document.getElementById('registerError');
            const successEl = document.getElementById('registerSuccess');
            errorEl.textContent = '';
            successEl.textContent = '';

            try {
                const res = await api.post('/auth/register', { name, email, password, referralCode });
                
                if (res.data && res.data.requiresVerification) {
                    const display = document.getElementById('verifyEmailDisplay');
                    const input = document.getElementById('verifyEmailInput');
                    if (display) display.textContent = res.data.email;
                    if (input) input.value = res.data.email;
                    
                    if (window.setAuthView) window.setAuthView('verify');

                    const testCodeBox = document.getElementById('testMockCode');
                    const testCodeValue = document.getElementById('testMockCodeValue');
                    if (testCodeBox && testCodeValue) {
                        testCodeValue.textContent = res.data.mockCode;
                        testCodeBox.style.display = 'block';
                    }
                } else {
                    successEl.textContent = 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.';
                    registerForm.reset();
                }
            } catch (error) {
                errorEl.textContent = error.message;
            }
        });
    }

    const verifyForm = document.getElementById('verifyForm');
    if (verifyForm) {
        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('verifyEmailInput').value;
            const errorEl = document.getElementById('verifyError');
            errorEl.textContent = '';
            
            let code = '';
            document.querySelectorAll('.otp-input').forEach(input => code += input.value);

            if (code.length !== 6) {
                errorEl.textContent = 'Lütfen 6 haneli kodu eksiksiz girin.';
                return;
            }

            try {
                const btn = verifyForm.querySelector('button');
                btn.textContent = 'Doğrulanıyor...';
                
                const res = await api.post('/auth/verify', { email, code });
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                
                // Add a small delay for smooth visual transition
                setTimeout(() => {
                    const token = res.data.token;
                    const user = encodeURIComponent(JSON.stringify(res.data.user));
                    const host = window.location.hostname;
                    window.location.href = `http://${host}:5173/dashboard?token=${token}&user=${user}`;
                }, 500);
            } catch (error) {
                errorEl.textContent = error.message;
                verifyForm.querySelector('button').textContent = 'Doğrula ve Giriş Yap';
            }
        });
    }

    // Auto-fill referral code from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    if (refParam && document.getElementById('registerRefCode')) {
        document.getElementById('registerRefCode').value = refParam;
    }
});
