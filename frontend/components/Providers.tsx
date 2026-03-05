"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'

export const queryClient = new QueryClient();

// Simple Cart Context for persistence
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};

export default function Providers({ children }: { children: ReactNode }) {
    const [client] = useState(() => new QueryClient())
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try { setCart(JSON.parse(saved)); } catch (e) { }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
            }
            return [...prev, item];
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter(i => i.id !== id));
    };

    const clearCart = () => setCart([]);

    return (
        <QueryClientProvider client={client}>
            <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
                {children}
            </CartContext.Provider>
        </QueryClientProvider>
    )
}
