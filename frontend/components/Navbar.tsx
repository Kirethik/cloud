"use client"
import Link from 'next/link';
import { useCart } from './Providers';
import { ShoppingCart, LogIn, User, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { cart } = useCart();
    const [isMounted, setIsMounted] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        setToken(localStorage.getItem('token'));
    }, []);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        router.push('/auth/login');
    };

    return (
        <nav className="bg-white  shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-primary-600 ">
                    AzureShop
                </Link>

                <div className="flex-grow max-w-md mx-6 hidden md:flex items-center">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500  "
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <Link href="/cart" className="relative flex items-center text-gray-700  hover:text-primary-600">
                        <ShoppingCart className="h-6 w-6" />
                        {isMounted && totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {isMounted && token ? (
                        <div className="flex items-center space-x-4">
                            <Link href="/orders" className="text-gray-600 ">Orders</Link>
                            <button onClick={handleLogout} className="text-sm font-medium text-gray-600 ">Logout</button>
                        </div>
                    ) : (
                        <Link href="/auth/login" className="flex items-center text-gray-700  hover:text-primary-600">
                            <LogIn className="h-5 w-5 mr-1" />
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
