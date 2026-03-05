import { CosmosClient, Container } from '@azure/cosmos';
import { env } from '../config/env';
import { getTelemetryClient } from '../telemetry/appInsights';

let client: CosmosClient;
let container: Container;

export const connectCosmosDB = async () => {
    const telemetry = getTelemetryClient();

    try {
        if (!env.COSMOS_ENDPOINT || !env.COSMOS_KEY) {
            console.warn("⚠️ Cosmos DB credentials not provided. Cosmos skipped.");
            return;
        }

        client = new CosmosClient({
            endpoint: env.COSMOS_ENDPOINT,
            key: env.COSMOS_KEY,
        });

        const database = client.database(env.COSMOS_DATABASE);
        container = database.container(env.COSMOS_CONTAINER);

        // Initial ping to assure connectivity
        await database.read();
        console.log(`✅ Azure Cosmos DB connected: ${env.COSMOS_DATABASE}/${env.COSMOS_CONTAINER}`);
    } catch (error) {
        telemetry?.trackException({ exception: error as Error });
        console.error('❌ Cosmos DB Connection Error:', error);
        process.exit(1);
    }
};

export const getCosmosContainer = (): Container => {
    if (!container) {
        throw new Error('Cosmos DB Container not initialized');
    }
    return container;
};
