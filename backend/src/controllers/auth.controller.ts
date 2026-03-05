import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/error.middleware';
import { authService } from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw Object.assign(new Error('Email and password required'), { statusCode: 400 });
        }

        const { token, user } = await authService.register(email, password);

        res.status(201).json({
            success: true,
            token,
            data: user
        });
    } catch (err: any) {
        if (err.message === 'User already exists') {
            err.statusCode = 409;
        }
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw Object.assign(new Error('Email and password required'), { statusCode: 400 });
        }

        const { token, user } = await authService.login(email, password);

        res.status(200).json({
            success: true,
            token,
            data: user
        });
    } catch (err: any) {
        if (err.message === 'Invalid email or password') {
            err.statusCode = 401;
        }
        next(err);
    }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Standard stateless JWT: client discards token.
        res.status(200).json({
            success: true,
            data: {},
            message: "Logged out successfully"
        });
    } catch (err) {
        next(err);
    }
};
