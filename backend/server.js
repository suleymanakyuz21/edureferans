require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/config/prisma');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test Database Connection
    await prisma.$connect();
    console.log('✅ Veritabanı bağlantısı başarılı.');

    app.listen(PORT, () => {
      console.log(`🚀 Sunucu http://localhost:${PORT} üzerinde çalışıyor.`);
    });
  } catch (error) {
    console.error('❌ Sunucu başlatılamadı:', error);
    process.exit(1);
  }
}

startServer();
