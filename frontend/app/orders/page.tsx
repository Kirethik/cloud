"use client"
import { useQuery } from '@tanstack/react-query';
import { getUserOrders } from '@/services/api';
import { useState, useEffect } from 'react';

export default function Orders() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(localStorage.getItem('token'));
    }, []);

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['orders'],
        queryFn: getUserOrders,
        enabled: !!token,
    });

    if (!token) return <div className="text-center py-20 text-xl font-bold">Please log in to view orders.</div>;
    if (isLoading) return <div className="text-center py-20 font-bold animate-pulse text-xl">Loading Orders...</div>;

    if (error) return <div className="text-center text-red-500 py-20 font-bold">Failed to load orders. Session might have expired.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-900 ">Order History</h1>

            {orders.length === 0 ? (
                <div className="bg-white  p-8 rounded-2xl shadow-sm text-center">
                    <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="relative overflow-x-auto shadow-md sm:rounded-2xl">
                    <table className="w-full text-sm text-left text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                            <tr>
                                <th scope="col" className="px-6 py-4">Order ID</th>
                                <th scope="col" className="px-6 py-4">Date</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order: any) => (
                                <tr key={order.id} className="bg-white border-b   hover:bg-gray-50  transition">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                        {order.id.split('-')[0]}...
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold leading-tight">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-900 ">
                                        ${order.total_price.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
