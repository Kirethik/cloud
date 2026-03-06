import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import Redis from 'ioredis';
import { env } from '../config/env';
import { getTelemetryClient } from '../telemetry/appInsights';

let redisClient: Redis;

export const connectRedis = () => {
    const telemetry = getTelemetryClient();

    if (!env.REDIS_HOST) {
        console.warn("⚠️ Redis host not provided. Caching disabled.");
        return;
    }

    redisClient = new Redis({
        host: env.REDIS_HOST,
        port: parseInt(env.REDIS_PORT),
        password: env.REDIS_PASSWORD || undefined,
        tls: {},
    });

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
