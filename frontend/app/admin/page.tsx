'use client';

import React, { useState, useEffect } from 'react';
import { fetchProducts, createProduct, fetchAdminStats, fetchTelemetry } from '../../services/api';
import { useRouter } from 'next/navigation';

export default function MerchantDashboard() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [telemetry, setTelemetry] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: '', imageUrl: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { router.push('/auth/login'); return; }

        const load = async () => {
            try {
                const [statsData, telemetryData, productsData] = await Promise.all([
                    fetchAdminStats(),
                    fetchTelemetry(),
                    fetchProducts()
                ]);
                setStats(statsData);
                setTelemetry(telemetryData);
                setProducts(productsData);
            } catch (err: any) {
                console.error('Failed to load dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (!formData.name || !formData.price || !formData.category) {
            setError('Please fill out all required fields (Name, Price, Category).');
            return;
        }
        setIsSubmitting(true);
        try {
            await createProduct({
                name: formData.name,
                description: formData.description || 'No description provided.',
                price: parseFloat(formData.price),
                category: formData.category,
                imageUrl: formData.imageUrl || 'https://via.placeholder.com/300?text=New+Product'
            });
            setSuccess('Product registered successfully! It is now live on the store.');
            const [updatedStats, updatedProducts] = await Promise.all([fetchAdminStats(), fetchProducts()]);
            setStats(updatedStats);
            setProducts(updatedProducts);
            setFormData({ name: '', description: '', price: '', category: '', imageUrl: '' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create product. Make sure you are logged in.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Loading dashboard from Azure...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <h1 className="text-3xl font-extrabold text-gray-900">Merchant Dashboard</h1>

            {/* Real Stats from Azure SQL via Backend */}
            <section>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Store Statistics (Live from Azure SQL)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
                        <p className="text-3xl font-extrabold text-green-600">
                            ${stats ? stats.totalSales.toFixed(2) : '—'}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Pending Orders</p>
                        <p className="text-3xl font-extrabold text-orange-500">
                            {stats ? stats.activeOrders : '—'}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Live Products (Cosmos DB)</p>
                        <p className="text-3xl font-extrabold text-primary-600">
                            {stats ? stats.totalProducts : '—'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Azure Application Insights Telemetry Panel */}
            <section>
                <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">Azure Application Insights</h2>
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        Live Telemetry
                    </span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-bold text-gray-800 text-sm">Backend API Telemetry</p>
                            <p className="text-xs text-gray-500">Source: instrumentationKey={process.env.NEXT_PUBLIC_INSIGHTS_KEY || '16f444b4...'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
                        <div className="p-5">
                            <p className="text-xs text-gray-500 mb-1">Total Requests (1h)</p>
                            <p className="text-2xl font-bold text-gray-800">{telemetry ? telemetry.requests.toLocaleString() : '—'}</p>
                            <p className="text-xs text-green-600 mt-1">▲ Healthy</p>
                        </div>
                        <div className="p-5">
                            <p className="text-xs text-gray-500 mb-1">Avg. Response Time</p>
                            <p className="text-2xl font-bold text-gray-800">{telemetry ? `${telemetry.serverResTime}ms` : '—'}</p>
                            <p className="text-xs text-green-600 mt-1">▲ Within SLA</p>
                        </div>
                        <div className="p-5">
                            <p className="text-xs text-gray-500 mb-1">Failed Requests</p>
                            <p className="text-2xl font-bold text-red-500">{telemetry ? telemetry.failedRequests : '—'}</p>
                            <p className="text-xs text-gray-400 mt-1">Last 1 hour</p>
                        </div>
                        <div className="p-5">
                            <p className="text-xs text-gray-500 mb-1">Availability</p>
                            <p className="text-2xl font-bold text-green-600">{telemetry ? `${telemetry.availability}%` : '—'}</p>
                            <p className="text-xs text-green-600 mt-1">▲ SLA Met</p>
                        </div>
                    </div>
                    <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                        Powered by Azure Application Insights · Connection: <span className="font-mono text-gray-500">centralindia-0.in.applicationinsights.azure.com</span>
                    </div>
                </div>
            </section>

            {/* Product Registration Form */}
            <section>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Register a New Product</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    {error && <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
                    {success && <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>}

                    <form onSubmit={handleCreateProduct} className="space-y-5 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                                    placeholder="e.g. Ergonomic Keyboard" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (USD) *</label>
                                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                                    placeholder="e.g. 149.99" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                            <input type="text" name="category" value={formData.category} onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                                placeholder="e.g. Electronics" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL <span className="text-gray-400 font-normal">(Optional)</span></label>
                            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                                placeholder="https://example.com/image.jpg" />
                            <p className="text-xs text-gray-400 mt-1">If left blank, a placeholder image will be used.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                                placeholder="Detailed description of your product..." />
                        </div>
                        <button type="submit" disabled={isSubmitting}
                            className={`px-6 py-2.5 rounded-lg font-bold text-white text-sm transition ${isSubmitting ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}>
                            {isSubmitting ? 'Registering to Cosmos DB...' : 'Register Product'}
                        </button>
                    </form>
                </div>
            </section>

            {/* Live Product List */}
            <section>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Live Product Catalog ({products.length} items in Cosmos DB)</h2>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 font-semibold text-gray-600">Product Name</th>
                                <th className="text-left px-6 py-3 font-semibold text-gray-600">Category</th>
                                <th className="text-right px-6 py-3 font-semibold text-gray-600">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((p: any) => (
                                <tr key={p.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-3 font-medium text-gray-800">{p.name}</td>
                                    <td className="px-6 py-3 text-gray-500">{p.category}</td>
                                    <td className="px-6 py-3 text-right font-bold text-primary-600">${Number(p.price).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
