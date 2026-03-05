import { Request, Response, NextFunction } from 'express';
import { productRepository } from '../repositories/product.repository';
import { getRedisClient } from '../cache/redis';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const redis = getRedisClient();
        const cacheKey = 'products:all';

        if (redis) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return res.status(200).json({
                    success: true,
                    source: 'cache',
                    data: JSON.parse(cached),
                });
            }
        }

        const products = await productRepository.getAll();

        if (redis) {
            // Cache expiration: 10 minutes
            await redis.setex(cacheKey, 600, JSON.stringify(products));
        }

        res.status(200).json({
            success: true,
            source: 'database',
            count: products.length,
            data: products,
        });
    } catch (err) {
        next(err);
    }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const redis = getRedisClient();
        const cacheKey = `product:${id}`;

        if (redis) {
            const cached = await redis.get(cacheKey);
            if (cached) {
                return res.status(200).json({ success: true, source: 'cache', data: JSON.parse(cached) });
            }
        }

        const product = await productRepository.getById(id);

        if (!product) {
            throw Object.assign(new Error(`Product not found with id of ${id}`), { statusCode: 404 });
        }

        if (redis) {
            await redis.setex(cacheKey, 600, JSON.stringify(product));
        }

        res.status(200).json({ success: true, source: 'database', data: product });
    } catch (err) {
        next(err);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productRepository.create(req.body);

        // Invalidate list cache
        const redis = getRedisClient();
        if (redis) await redis.del('products:all');

        res.status(201).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const updated = await productRepository.update(id, req.body);

        if (!updated) {
            throw Object.assign(new Error(`Product not found with id of ${id}`), { statusCode: 404 });
        }

        // Invalidate caches
        const redis = getRedisClient();
        if (redis) {
            await redis.del('products:all');
            await redis.del(`product:${id}`);
        }

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        await productRepository.delete(id);

        // Invalidate caches
        const redis = getRedisClient();
        if (redis) {
            await redis.del('products:all');
            await redis.del(`product:${id}`);
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
