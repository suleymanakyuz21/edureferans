document.addEventListener('DOMContentLoaded', async () => {
    // Auth Check
    if (!localStorage.getItem('token')) {
        window.location.href = '/';
        return;
    }

    const userStr = localStorage.getItem('user');
    let currentUser = null;
    if (userStr) {
        currentUser = JSON.parse(userStr);
        document.getElementById('userNameDisplay').textContent = `Merhaba, ${currentUser.name.split(' ')[0]}`;
        document.getElementById('userAvatar').textContent = currentUser.name.substring(0, 2).toUpperCase();
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    });

    // Tab Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked nav item
            item.classList.add('active');

            // Hide all tab panes
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Show target tab pane
            const targetId = `tab-${item.getAttribute('data-target')}`;
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Load Data
    const loadDashboard = async () => {
        try {
            const res = await api.get('/users/dashboard');
            const data = res.data;

            // Fill Overview Stats
            document.getElementById('valBalance').textContent = `${data.balance} ₺`;
            document.getElementById('valEarned').textContent = `${data.totalEarned} ₺`;
            document.getElementById('valReferrals').textContent = data.referralsCount;
            document.getElementById('valGrandReferrals').textContent = data.grandReferralsCount;

            // Fill Referral Info
            document.getElementById('refCodeInput').value = data.refCode;
            const refLink = `${window.location.origin}/?ref=${data.refCode}`;
            document.getElementById('refLinkInput').value = refLink;

            // Handle Premium State
            if (!data.isPremium) {
                document.getElementById('premiumBanner').style.display = 'flex';
                document.getElementById('referralContent').style.display = 'none';
                document.getElementById('referralLocked').style.display = 'block';
                document.getElementById('coursesList').innerHTML = `
                    <div class="card premium-lock" style="grid-column: 1 / -1; margin-top: 2rem;">
                        <span class="lock-icon">🔒</span>
                        <h3 style="color: #818cf8; margin-bottom: 0.5rem;">Eğitimlere Erişim Kapalı</h3>
                        <p style="color: var(--text-secondary);">Eğitim videolarına erişmek için Premium üye olmalısınız.</p>
                    </div>
                `;
            } else {
                document.getElementById('premiumBanner').style.display = 'none';
                document.getElementById('referralContent').style.display = 'block';
                document.getElementById('referralLocked').style.display = 'none';
                loadCourses();
            }

            // Fill Transactions Table
            const tbody = document.getElementById('commissionsTableBody');
            if (data.recentCommissions.length > 0) {
                tbody.innerHTML = data.recentCommissions.map(c => `
                    <tr>
                        <td style="font-weight: 500;">${c.from}</td>
                        <td><span class="badge" style="background: rgba(255,255,255,0.1); color: #fff;">L${c.level}</span></td>
                        <td style="color: var(--text-secondary);">${new Date(c.date).toLocaleDateString('tr-TR')}</td>
                        <td><span class="badge badge-success">Başarılı</span></td>
                        <td class="text-success" style="font-weight: 700;">+${c.amount} ₺</td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--text-secondary); padding: 3rem;">Henüz hiçbir komisyon işleminiz bulunmuyor.</td></tr>`;
            }

        } catch (error) {
            console.error(error);
            if (error.message === 'Invalid or expired token.') {
                localStorage.clear();
                window.location.href = '/';
            }
        }
    };

    const loadCourses = async () => {
        try {
            const res = await api.get('/courses');
            const courses = res.data;
            const coursesList = document.getElementById('coursesList');
            
            if (courses.length > 0) {
                coursesList.innerHTML = courses.map(c => `
                    <div class="course-card">
                        <div class="course-thumbnail">
                            ${c.title.includes('Kripto') ? '🪙' : c.title.includes('E-Ticaret') ? '🛒' : '📚'}
                        </div>
                        <div class="course-info">
                            <h3>${c.title}</h3>
                            <p>${c.description}</p>
                            <a href="${c.videoUrl}" target="_blank" class="course-play-btn">▶ Videoyu İzle</a>
                        </div>
                    </div>
                `).join('');
            } else {
                coursesList.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1 / -1; text-align: center;">Henüz kurs bulunmuyor.</p>';
            }
        } catch (error) {
            console.error('Kurslar yüklenemedi:', error);
        }
    };

    // Copy Button
    document.getElementById('copyLinkBtn').addEventListener('click', function() {
        const linkInput = document.getElementById('refLinkInput');
        linkInput.select();
        document.execCommand('copy');
        
        const originalText = this.textContent;
        this.textContent = 'Kopyalandı!';
        this.style.background = '#10b981';
        this.style.color = '#fff';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
            this.style.color = '';
        }, 2000);
    });

    // Mock Premium Purchase
    document.getElementById('buyPremiumBtn').addEventListener('click', async function() {
        const originalText = this.textContent;
        this.textContent = 'İşleniyor...';
        this.disabled = true;

        try {
            const res = await api.post('/payment/mock-payment-success');
            
            // Refresh user data in localstorage
            if (currentUser) {
                currentUser.isPremium = true;
                localStorage.setItem('user', JSON.stringify(currentUser));
            }
            
            alert('Tebrikler! Ödemeniz alındı ve Premium üyeliğiniz aktif edildi.');
            loadDashboard(); // Reload data to unlock UI
            
            // Switch to Courses tab automatically
            document.querySelector('.nav-item[data-target="courses"]').click();
            
        } catch (error) {
            alert(error.message);
            this.textContent = originalText;
            this.disabled = false;
        }
    });

    // Initialize
    loadDashboard();
});
