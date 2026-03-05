import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from './error.middleware';
import { AuthPayload } from '../models/types';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            const error = new Error('Not authorized, no token') as AppError;
            error.statusCode = 401;
            return next(error);
        }

        if (!env.JWT_SECRET) {
            const error = new Error('Server missing JWT configuration') as AppError;
            error.statusCode = 500;
            return next(error);
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
        req.user = decoded;

        next();
    } catch (err) {
        const error = new Error('Not authorized, token failed') as AppError;
        error.statusCode = 401;
        next(error);
    }
};
