# Eğitim Platformu ve Referans Sistemi

Bu proje, Node.js, Express, Prisma ve PostgreSQL kullanılarak geliştirilmiş modern bir SaaS eğitim platformudur. Sistemde 2 seviyeli referans sistemi bulunmaktadır.

## Özellikler

* **Kullanıcı Kaydı ve Girişi (JWT)**
* **2 Seviyeli Referans Sistemi**:
  * 1. Seviye Referans: %25 Komisyon
  * 2. Seviye Referans: %10 Komisyon
* **Mock Ödeme Sistemi**: (Premium üyelik aktivasyonu)
* **Kullanıcı Paneli (Dashboard)**: Kazanç istatistikleri, referans linki, komisyon geçmişi.
* **Kurs Görüntüleme**: Sadece premium üyeler kurs içeriklerine erişebilir.
* **Yönetici Paneli**: Tüm kullanıcıları, ödemeleri ve komisyonları listeleme.
* **Modern Dark Tema**: HTML, CSS, Vanilla JS ile duyarlı (responsive) tasarım.

## Kurulum ve Çalıştırma

1. **Gereksinimleri Yükleyin**
```bash
npm install
```

2. **Veritabanını Hazırlayın**
PostgreSQL veritabanınızın çalıştığından emin olun ve `.env` dosyasındaki `DATABASE_URL` bilgisini kendinize göre güncelleyin.
```bash
npx prisma db push
```

3. **Örnek Verileri (Seed) Ekleyin**
```bash
npm run seed
```

4. **Projeyi Başlatın**
```bash
npm start
# veya geliştirme ortamı için
npm run dev
```

Platforma http://localhost:3000 adresinden erişebilirsiniz.
