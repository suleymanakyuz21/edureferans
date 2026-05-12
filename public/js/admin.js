document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load Users
        const usersRes = await api.get('/admin/users');
        const usersTbody = document.getElementById('usersTableBody');
        usersTbody.innerHTML = usersRes.data.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.balance} ₺</td>
                <td>${u.isPremium ? 'Evet' : 'Hayır'}</td>
            </tr>
        `).join('');

        // Load Payments
        const paymentsRes = await api.get('/admin/payments');
        const paymentsTbody = document.getElementById('paymentsTableBody');
        paymentsTbody.innerHTML = paymentsRes.data.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.user.name}</td>
                <td>${p.amount} ₺</td>
                <td><span class="text-success">${p.status}</span></td>
            </tr>
        `).join('');

        // Load Commissions
        const commRes = await api.get('/admin/commissions');
        const commTbody = document.getElementById('commissionsTableBody');
        commTbody.innerHTML = commRes.data.map(c => `
            <tr>
                <td>${c.fromUser.name}</td>
                <td>${c.toUser.name}</td>
                <td>L${c.level}</td>
                <td>${c.amount} ₺</td>
                <td>${new Date(c.createdAt).toLocaleDateString('tr-TR')}</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Admin datası yüklenemedi:', error);
        alert('Veriler yüklenirken hata oluştu.');
    }
});
