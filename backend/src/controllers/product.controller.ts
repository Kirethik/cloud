import { Request, Response, NextFunction } from 'express';
import { productRepository } from '../repositories/product.repository';
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productRepository.getAll();

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

        const product = await productRepository.getById(id);

        if (!product) {
            throw Object.assign(new Error(`Product not found with id of ${id}`), { statusCode: 404 });
        }

        res.status(200).json({ success: true, source: 'database', data: product });
    } catch (err) {
        next(err);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productRepository.create(req.body);

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

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        await productRepository.delete(id);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
