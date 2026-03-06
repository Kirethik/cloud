import { Request, Response, NextFunction } from 'express';
import prisma from '../database/sql';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw Object.assign(new Error('User must be logged in'), { statusCode: 401 });
        }

        const { items, total_price } = req.body;

        if (!items || items.length === 0) {
            throw Object.assign(new Error('No order items provided'), { statusCode: 400 });
        }

        // Creating order in Azure SQL via Prisma
        const order = await prisma.order.create({
            data: {
                user_id: req.user.userId,
                total_price,
                status: 'PENDING',
                items: {
                    create: items.map((item: any) => ({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: true
            }
        });

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw Object.assign(new Error('User must be logged in'), { statusCode: 401 });
        }

        const orders = await prisma.order.findMany({
            where: { user_id: req.user.userId },
            include: { items: true },
            orderBy: { created_at: 'desc' },
        });

        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw Object.assign(new Error('User must be logged in'), { statusCode: 401 });
        }

        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: { items: true },
        });

        if (!order) {
            throw Object.assign(new Error('Order not found'), { statusCode: 404 });
        }

        if (order.user_id !== req.user.userId) { // Minimal validation
            throw Object.assign(new Error('Unauthorized access to this order'), { statusCode: 403 });
        }

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

import { productRepository } from '../repositories/product.repository';

export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw Object.assign(new Error('User must be logged in'), { statusCode: 401 });
        }

        const orders = await prisma.order.findMany();
        const totalSales = orders.reduce((acc, order) => acc + order.total_price, 0);
        const activeOrders = orders.filter(o => o.status === 'PENDING').length;

        const products = await productRepository.getAll();

        res.status(200).json({
            success: true,
            data: {
                totalSales,
                activeOrders,
                totalProducts: products.length
            }
        });
    } catch (err) {
        next(err);
    }
};

export const getTelemetry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw Object.assign(new Error('User must be logged in'), { statusCode: 401 });
        }

        // Simulating Azure App Insights metrics for the requested UI
        res.status(200).json({
            success: true,
            data: {
                requests: Math.floor(Math.random() * 500) + 1500,
                serverResTime: Math.floor(Math.random() * 50) + 120, // ms
                failedRequests: Math.floor(Math.random() * 10),
                availability: 99.98
            }
        });
    } catch (err) {
        next(err);
    }
};
