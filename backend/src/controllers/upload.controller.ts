import { Request, Response, NextFunction } from 'express';
import { getBlobContainerClient } from '../storage/blob';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw Object.assign(new Error('No image file provided'), { statusCode: 400 });
        }

        const containerClient = getBlobContainerClient();

        // Create unique filename
        const extName = path.extname(req.file.originalname);
        const blobName = `${uuidv4()}${extName}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload to Azure Blob Storage
        await blockBlobClient.uploadData(req.file.buffer, {
            blobHTTPHeaders: { blobContentType: req.file.mimetype }
        });

        // Determine URL (Here you could replace the host with your Azure CDN endpoint)
        const cdnUrl = blockBlobClient.url;
        // Example: cdnUrl.replace('myaccount.blob.core.windows.net', 'mycdn.azureedge.net');

        res.status(200).json({
            success: true,
            data: {
                imageUrl: cdnUrl,
            }
        });

    } catch (err) {
        next(err);
    }
};
