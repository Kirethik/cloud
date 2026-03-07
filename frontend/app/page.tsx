"use client"
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/api';
import ProductCard from '@/components/ProductCard';
import { useState } from 'react';

export default function Home() {
    const { data: products, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts
    });

    const [category, setCategory] = useState<string>('All');
    const categories = ['All', 'Electronics', 'Clothing', 'Home'];

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">Failed to load products from API. Make sure backend is running.</span>
        </div>
    );

    const filteredProducts = category === 'All'
        ? products
        : products?.filter((p: any) => p.category === category);

    return (
        <div className="space-y-8">
            <div className="text-center bg-primary-50  py-12 rounded-3xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900  mb-4">
                    Welcome to KirethikShop
                </h1>
            </div>

            <div className="flex justify-center space-x-4 mb-8">
                {categories.map(c => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${category === c
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200  text-gray-800  hover:bg-gray-300'
                            }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {filteredProducts && filteredProducts.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No products found in this category.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts?.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
