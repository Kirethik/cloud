export interface Product {
    id: string; // Cosmos DB requires string IDs typically
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    stock: number;
    createdAt: string; // ISO String
    updatedAt: string; // ISO String
}

export interface AuthPayload {
    userId: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}
