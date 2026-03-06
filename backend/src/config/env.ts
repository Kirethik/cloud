import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('8080'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    COSMOS_ENDPOINT: z.string().optional(),
    COSMOS_KEY: z.string().optional(),
    COSMOS_DATABASE: z.string().default('ecommerce-db'),
    COSMOS_CONTAINER: z.string().default('products'),

    SQL_SERVER: z.string().optional(),
    SQL_DATABASE: z.string().default('orders-db'),
    SQL_USER: z.string().optional(),
    SQL_PASSWORD: z.string().optional(),

    DATABASE_URL: z.string().optional(), // Used by prisma

    AZURE_STORAGE_CONNECTION_STRING: z.string().optional(),

    APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),

    KEY_VAULT_URI: z.string().optional(),
    KEY_VAULT_ENABLED: z.string().default('false').transform(v => v === 'true'),

    JWT_SECRET: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:", _env.error.format());
    throw new Error("Invalid environment variables");
}

export const env = _env.data;
