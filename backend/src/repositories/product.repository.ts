import { getCosmosContainer } from '../database/cosmos';
import { Product } from '../models/types';
import { v4 as uuidv4 } from 'uuid';
import { getRedisClient } from '../cache/redis';

export class ProductRepository {
    private get container() {
        return getCosmosContainer();
    }

    async getAll(): Promise<Product[]> {
        const querySpec = { query: 'SELECT * FROM c' };
        const { resources: products } = await this.container.items.query<Product>(querySpec).fetchAll();
        return products;
    }

    async getById(id: string): Promise<Product | null> {
        const { resource } = await this.container.item(id, id).read<Product>();
        return resource || null;
    }

    async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
        const newProduct: Product = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Cosmos expects a partition key; assuming 'category' is partition key or id is pk
        // Let's assume id is both id and partition key for simplicity, or we design schema suitably.
        const { resource } = await this.container.items.create<Product>(newProduct);
        if (!resource) throw new Error("Cosmos resource not created");
        return resource;
    }

    async update(id: string, data: Partial<Product>): Promise<Product | null> {
        const current = await this.getById(id);
        if (!current) return null;

        const updatedProduct = {
            ...current,
            ...data,
            updatedAt: new Date().toISOString(),
        };

        const { resource } = await this.container.item(id, id).replace<Product>(updatedProduct);
        return resource || null;
    }

    async delete(id: string): Promise<void> {
        await this.container.item(id, id).delete();
    }
}

export const productRepository = new ProductRepository();
