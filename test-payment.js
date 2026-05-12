require('dotenv').config();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return console.log("No users found.");
    
    console.log("Testing for user ID:", user.id);
    
    // Simulate what the controller does
    const amount = 10000;
    
    await prisma.$transaction(async (tx) => {
        await tx.payment.create({
            data: { userId: user.id, amount, status: 'COMPLETED' }
        });
        await tx.user.update({
            where: { id: user.id },
            data: { isPremium: true }
        });
        
        if (user.referredById) {
            const lvl1Amount = amount * 0.25;
            await tx.user.update({
                where: { id: user.referredById },
                data: { balance: { increment: lvl1Amount } }
            });
            await tx.commission.create({
                data: { fromUserId: user.id, toUserId: user.referredById, level: 1, amount: lvl1Amount }
            });
            await tx.notification.create({
                data: { userId: user.referredById, type: 'commission', title: 'Test', message: 'Test' }
            });
        }
    });
    console.log("Transaction SUCCESSFUL!");
  } catch (err) {
    console.error("TRANSACTION ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
