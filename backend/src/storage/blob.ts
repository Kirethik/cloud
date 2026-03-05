import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { env } from '../config/env';
import { getTelemetryClient } from '../telemetry/appInsights';

const CONTAINER_NAME = 'product-images';
let blobServiceClient: BlobServiceClient;
let containerClient: ContainerClient;

export const connectBlobStorage = async () => {
    const telemetry = getTelemetryClient();

    if (!env.AZURE_STORAGE_CONNECTION_STRING) {
        console.warn("⚠️ Azure Storage Connection String not provided. Blob Storage disabled.");
        return;
    }

    try {
        blobServiceClient = BlobServiceClient.fromConnectionString(env.AZURE_STORAGE_CONNECTION_STRING);
        containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

        // Create container if it does not exist (we'll set public access via portal generally)
        const exists = await containerClient.exists();
        if (!exists) {
            await containerClient.create({ access: 'blob' });
            console.log(`✅ Created Blob Container: ${CONTAINER_NAME}`);
        } else {
            console.log(`✅ Connected to Blob Container: ${CONTAINER_NAME}`);
        }
    } catch (error) {
        telemetry?.trackException({ exception: error as Error });
        console.error('❌ Blob Storage Connection Error:', error);
    }
};

export const getBlobContainerClient = (): ContainerClient => {
    if (!containerClient) {
        throw new Error('Blob Storage Container Client not initialized');
    }
    return containerClient;
};
