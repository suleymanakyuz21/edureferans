const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@edu.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@edu.com',
            password: hashedPassword,
            refCode: 'ADM12345',
            isPremium: true
        }
    });
    console.log(`Created user: ${admin.name}`);

    // Create some mock courses
    const courses = [
        {
            title: 'Node.js ile Backend Geliştirme',
            description: 'Sıfırdan ileri seviye Node.js ve Express.js eğitimi.',
            videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
            category: 'Backend'
        },
        {
            title: 'Modern Frontend Mimarisi',
            description: 'Vanilla JS, CSS ve UI Design prensipleri.',
            videoUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
            category: 'Frontend'
        },
        {
            title: 'SaaS Uygulaması Geliştirme',
            description: 'Baştan sona SaaS projesi kurma ve yayınlama.',
            videoUrl: 'https://www.youtube.com/watch?v=f2EqECiTBL8',
            category: 'Fullstack'
        }
    ];

    // Check if courses already exist to prevent duplicates on multiple seeds
    const existingCount = await prisma.course.count();
    if (existingCount === 0) {
        for (const c of courses) {
            await prisma.course.create({ data: c });
        }
        console.log('Created mock courses.');
    } else {
        console.log('Courses already exist, skipping.');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
