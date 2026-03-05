import { Request, Response, NextFunction } from 'express';
import { getProductById } from '../../src/controllers/product.controller';
import { productRepository } from '../../src/repositories/product.repository';

// Mock dependencies
jest.mock('../../src/repositories/product.repository');
jest.mock('../../src/cache/redis', () => ({
    getRedisClient: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(null),
        setex: jest.fn()
    })
}));

describe('Product Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction = jest.fn();

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return a product by ID if it exists', async () => {
        const mockProduct = { id: 'test-uuid', name: 'Azure Cup', price: 9.99 };
        (productRepository.getById as jest.Mock).mockResolvedValue(mockProduct);

        mockRequest.params = { id: 'test-uuid' };

        await getProductById(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(productRepository.getById).toHaveBeenCalledWith('test-uuid');
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: true, source: 'database', data: mockProduct });
    });

    it('should throw HTTP 404 error if product is not found', async () => {
        (productRepository.getById as jest.Mock).mockResolvedValue(null);

        mockRequest.params = { id: 'invalid-id' };

        await getProductById(mockRequest as Request, mockResponse as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
        expect(nextFunction).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    });
});
