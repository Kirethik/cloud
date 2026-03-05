import { Request, Response, NextFunction } from 'express';
import { getTelemetryClient } from '../telemetry/appInsights';

// Simple interface for App Errors
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const telemetry = getTelemetryClient();
    const statusCode = err.statusCode || 500;

    if (telemetry) {
        telemetry.trackException({
            exception: err,
            properties: {
                statusCode: statusCode.toString(),
                path: req.path,
                method: req.method,
            },
        });
    }

    console.error(`❌ Error [${statusCode}]: ${err.message}`);

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
