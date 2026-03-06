"use client"
import { useCart } from '@/components/Providers';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

export default function Cart() {
    const { cart, removeFromCart, addToCart, clearCart } = useCart();

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    if (cart.length === 0) {
        return (
            <div className="text-center py-24">
                <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link href="/" className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-8">Shopping Cart</h1>

            <div className="bg-white  rounded-2xl shadow-sm overflow-hidden mb-8">
                <ul className="divide-y divide-gray-200 ">
                    {cart.map(item => (
                        <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                            <div className="relative h-24 w-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-lg font-bold">{item.name}</h3>
                                <p className="text-primary-600 font-bold">${item.price.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300  rounded-lg overflow-hidden">
                                    <button onClick={() => {
                                        if (item.quantity > 1) {
                                            addToCart({ ...item, quantity: -1 })
                                        }
                                    }} className="px-3 py-1 hover:bg-gray-100 ">-</button>
                                    <span className="px-4 py-1">{item.quantity}</span>
                                    <button onClick={() => addToCart({ ...item, quantity: 1 })} className="px-3 py-1 hover:bg-gray-100 ">+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 p-2">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-gray-50  p-8 rounded-2xl border border-gray-200  flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <p className="text-lg text-gray-500 mb-1">Total</p>
                    <p className="text-4xl font-extrabold">${total.toFixed(2)}</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button onClick={clearCart} className="flex-1 sm:flex-none border border-red-500 text-red-500 hover:bg-red-50 py-3 px-6 rounded-lg font-semibold transition">
                        Clear Cart
                    </button>
                    <Link href="/checkout" className="flex-1 sm:flex-none justify-center flex bg-primary-600 hover:bg-primary-700 text-white py-3 px-8 rounded-lg font-bold transition">
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
