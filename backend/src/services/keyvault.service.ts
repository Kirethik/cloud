import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";
import { env } from "../config/env";
import { getTelemetryClient } from "../telemetry/appInsights";

class KeyVaultService {
    private client: SecretClient | null = null;
    private cache: Map<string, string> = new Map();

    constructor() {
        if (env.KEY_VAULT_ENABLED && env.KEY_VAULT_URI) {
            const credential = new DefaultAzureCredential();
            this.client = new SecretClient(env.KEY_VAULT_URI, credential);
            console.log(`✅ Azure Key Vault client initialized: ${env.KEY_VAULT_URI}`);
        } else {
            console.log('⚠️ Azure Key Vault disabled or URI not provided.');
        }
    }

    async getSecret(secretName: string, fallbackEnvVar?: string): Promise<string> {
        const telemetry = getTelemetryClient();

        if (this.cache.has(secretName)) {
            return this.cache.get(secretName) as string;
        }

        try {
            if (this.client) {
                telemetry?.trackEvent({ name: "KeyVaultGetSecret", properties: { secretName } });
                const secret = await this.client.getSecret(secretName);
                if (secret.value) {
                    this.cache.set(secretName, secret.value);
                    return secret.value;
                }
            }
        } catch (error) {
            telemetry?.trackException({ exception: error as Error });
            console.error(`❌ Failed to retrieve secret ${secretName} from Key Vault:`, (error as Error).message);
        }

        // Fallback to local environment variable if Key Vault fails or is disabled
        if (fallbackEnvVar && env[fallbackEnvVar as keyof typeof env]) {
            return String(env[fallbackEnvVar as keyof typeof env]);
        }

        throw new Error(`Secret ${secretName} not found in Key Vault or environment fallback (${fallbackEnvVar})`);
    }
}

export const keyVaultService = new KeyVaultService();
