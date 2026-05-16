const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@edureferans.com';
  const password = 'AdminPassword123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({ where: { email } });

  if (existingAdmin) {
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN', password: hashedPassword }
    });
    console.log(`Admin user updated: ${email}`);
  } else {
    await prisma.user.create({
      data: {
        name: 'Süleyman Akyüz',
        email,
        password: hashedPassword,
        role: 'ADMIN',
        refCode: 'ADMINREF123',
      }
    });
    console.log(`Admin user created: ${email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
