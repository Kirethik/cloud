import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import Redis from 'ioredis';
import { env } from '../config/env';
import { getTelemetryClient } from '../telemetry/appInsights';

let redisClient: Redis;

export const connectRedis = () => {
    const telemetry = getTelemetryClient();

    if (!env.AZURE_REDIS_CONNECTIONSTRING) {
        console.warn("⚠️ Redis connection string not provided. Caching disabled.");
        return;
    }

    redisClient = new Redis(env.AZURE_REDIS_CONNECTIONSTRING);

    redisClient.on('connect', () => {
        console.log(`✅ Azure Redis Cache connected at ${env.REDIS_HOST}:${env.REDIS_PORT}`);
    });

    redisClient.on('error', (error) => {
        telemetry?.trackException({ exception: error as Error });
        console.error('❌ Redis Connection Error:', error);
    });
};

export const getRedisClient = (): Redis | null => {
    return redisClient || null;
};
