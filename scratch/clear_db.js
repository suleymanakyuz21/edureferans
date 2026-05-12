const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearData() {
    try {
        console.log('Cleaning up database...');
        
        // Delete dependent records first
        await prisma.commission.deleteMany({});
        await prisma.payment.deleteMany({});
        
        // Finally delete all users
        // Note: deleteMany handles the order if there are no circular dependencies that prevent it,
        // but since we have self-referencing User (referredBy), we might need to be careful.
        // Prisma usually handles this well if we just deleteMany users.
        await prisma.user.deleteMany({});
        
        console.log('Successfully cleared all user records, commissions and payments.');
    } catch (error) {
        console.error('Error clearing data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearData();
