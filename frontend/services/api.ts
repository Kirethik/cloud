import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const fetchProducts = async () => {
    const res = await api.get('/products');
    return res.data.data;
};

export const fetchProductById = async (id: string) => {
    const res = await api.get(`/products/${id}`);
    return res.data.data;
};

export const createOrder = async (orderData: any) => {
    const res = await api.post('/orders', orderData);
    return res.data;
};

export const getUserOrders = async () => {
    const res = await api.get('/orders');
    return res.data.data;
};

export const createProduct = async (productData: any) => {
    const res = await api.post('/products', productData);
    return res.data.data;
};

export const fetchAdminStats = async () => {
    const res = await api.get('/admin/stats');
    return res.data.data;
};

export const fetchTelemetry = async () => {
    const res = await api.get('/admin/telemetry');
    return res.data.data;
};
