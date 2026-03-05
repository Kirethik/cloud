import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database/sql';
import { env } from '../config/env';
import { AuthResponse } from '../models/types';

export class AuthService {
    async register(email: string, password_plain: string): Promise<AuthResponse> {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password_plain, salt);

        const user = await prisma.user.create({
            data: {
                email,
                password_hash,
            },
            select: {
                id: true,
                email: true,
            }
        });

        return {
            token: this.generateToken({ userId: user.id, email: user.email }),
            user,
        };
    }

    async login(email: string, password_plain: string): Promise<AuthResponse> {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password_plain, user.password_hash);

        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        return {
            token: this.generateToken({ userId: user.id, email: user.email }),
            user: { id: user.id, email: user.email },
        }
    }

    private generateToken(payload: { userId: string, email: string }): string {
        if (!env.JWT_SECRET) throw new Error("JWT SECRET is missing!");
        return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1d' });
    }
}

export const authService = new AuthService();
