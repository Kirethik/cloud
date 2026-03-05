"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './Providers';
import { ShoppingCart } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
}

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <Link href={`/products/${product.id}`}>
                <div className="relative h-64 w-full bg-gray-200">
                    <Image
                        src={product.imageUrl || '/placeholder.jpg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        unoptimized // Useful for external URLs if next.config.js remotePatterns isn't fully permissive
                    />
                </div>
            </Link>

            <div className="p-5 flex flex-col items-start">
                <span className="text-xs uppercase tracking-wider text-primary-600 font-semibold mb-1">
                    {product.category}
                </span>
                <Link href={`/products/${product.id}`} className="block">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1">
                        {product.name}
                    </h3>
                </Link>
                <p className="mt-2 text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
                    ${product.price.toFixed(2)}
                </p>

                <button
                    onClick={() => addToCart({ ...product, quantity: 1 })}
                    className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}
