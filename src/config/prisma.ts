import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const connectPrisma = async () => {
    try {
        await prisma.$connect()
        console.log('✅ Prisma connected successfully!')
    } catch (error) {
        console.error('❌ Error connecting to Prisma:', error)
    }
}

process.on('beforeExit', async () => {
    await prisma.$disconnect()
})
