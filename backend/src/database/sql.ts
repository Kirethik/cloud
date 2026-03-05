import { PrismaClient } from '@prisma/client';
import { getTelemetryClient } from '../telemetry/appInsights';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

export const connectSqlDB = async () => {
    const telemetry = getTelemetryClient();
    try {
        if (!process.env.DATABASE_URL) {
            console.warn('⚠️ DATABASE_URL not provided. SQL DB connection skipped.');
            return;
        }
        await prisma.$connect();
        console.log('✅ Azure SQL Database connected via Prisma');
    } catch (error) {
        telemetry?.trackException({ exception: error as Error });
        console.error('❌ Azure SQL Connection Error:', error);
        console.warn('⚠️ Server will continue running without SQL DB. SQL-dependent routes may fail.');
    }
};

export default prisma;
