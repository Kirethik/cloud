"use client"
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/services/api';
import { useCart } from '@/components/Providers';
import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id as string)
    });

    if (isLoading) return <div className="text-center py-20 animate-pulse text-xl font-bold">Loading product details...</div>;
    if (error || !product) return <div className="text-center text-red-500 py-20 font-bold">Failed to load product.</div>;

    const handleAdd = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl
        });
        alert('Added to cart!');
    };

    return (
        <div className="max-w-6xl mx-auto bg-white  rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 relative h-96 md:h-auto bg-gray-100">
                <Image
                    src={product.imageUrl || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-contain"
                    unoptimized
                />
            </div>

            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <span className="text-primary-600 font-bold tracking-wide uppercase">{product.category}</span>
                <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-gray-900 ">
                    {product.name}
                </h1>
                <p className="mt-4 text-2xl font-bold text-gray-900 ">
                    ${product.price.toFixed(2)}
                </p>

                <p className="mt-6 text-gray-600  text-lg leading-relaxed">
                    {product.description}
                </p>

                <div className="mt-8 flex items-center mb-8">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
                    <div className="flex items-center border border-gray-300  rounded-lg overflow-hidden shrink-0">
                        <button
                            className="px-4 py-3 bg-gray-100  hover:bg-gray-200  transition"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >-</button>
                        <span className="px-6 py-3 font-semibold ">{quantity}</span>
                        <button
                            className="px-4 py-3 bg-gray-100  hover:bg-gray-200  transition"
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        >+</button>
                    </div>
                    <button
                        disabled={product.stock === 0}
                        onClick={handleAdd}
                        className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
