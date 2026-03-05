import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Dashboard | AzureShop',
};

export default function AdminDashboard() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-4xl font-extrabold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Sales</h3>
                    <p className="text-3xl font-extrabold text-primary-600">$45,231.89</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Active Orders</h3>
                    <p className="text-3xl font-extrabold text-green-500">23</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Products in DB</h3>
                    <p className="text-3xl font-extrabold text-blue-500">142</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h2 className="text-xl font-bold">Product Management Console</h2>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition">
                        + New Product
                    </button>
                </div>

                <div className="p-8 text-center text-gray-500">
                    <p className="mb-4">Use this mock console to manage items in Cosmos DB and Azure SQL orders.</p>
                    <div className="inline-flex text-left text-sm bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono">
                        [Work in Progress]<br />
                        Implementation of form-based image upload via Blob Storage SDK <br />
                        and Product document upsert into Cosmos DB here.
                    </div>
                </div>
            </div>
        </div>
    );
}
