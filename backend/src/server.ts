import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { setupAppInsights } from './telemetry/appInsights';

import { connectCosmosDB } from './database/cosmos';
import { connectSqlDB } from './database/sql';
import { connectRedis } from './cache/redis';
import { connectBlobStorage } from './storage/blob';

import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

// Initialize Telemetry First
setupAppInsights();

const app: Application = express();

// Security and Utility Middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
app.use('/api', limiter);

// Mount API Routes under /api/v1
app.use('/api/v1', routes);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Not Found - ${req.originalUrl}`);
    (err as any).statusCode = 404;
    next(err);
});

// Centralized Error middleware
app.use(errorHandler);

const PORT = env.PORT || 8080;

app.listen(PORT, async () => {
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);

    // Initialize all Azure integrations lazily or eagerly depending on design.
    // Here we'll fire them asynchronously. If they fail, process exits.
    await connectCosmosDB();
    await connectSqlDB();
    connectRedis();
    await connectBlobStorage();
});
