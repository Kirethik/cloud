"use client"
import { useCart } from '@/components/Providers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { createOrder } from '@/services/api';
import { useRouter } from 'next/navigation';

const checkoutSchema = z.object({
    fullName: z.string().min(3, "Full name is required"),
    address: z.string().min(5, "Address must be complete"),
    city: z.string().min(2, "City is required"),
    zipCode: z.string().min(4, "Zip code is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
    const { cart, clearCart } = useCart();
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema)
    });

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const onSubmit = async (data: CheckoutForm) => {
        try {
            setSubmitting(true);
            const items = cart.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price }));

            const res = await createOrder({ items, total_price: total, shippingAddress: data });

            if (res.success) {
                clearCart();
                alert('Order Placed Successfully!');
                router.push('/orders');
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Checkout failed. Are you logged in?');
            if (error.response?.status === 401) {
                router.push('/auth/login?redirect=checkout');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (cart.length === 0) return <div className="text-center py-20 text-xl font-bold">Cart is empty!</div>;

    return (
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3 bg-white  p-8 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input {...register("fullName")} className="w-full p-3 border rounded-lg   focus:ring-2 outline-none" />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input {...register("address")} className="w-full p-3 border rounded-lg   focus:ring-2 outline-none" />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                    </div>
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">City</label>
                            <input {...register("city")} className="w-full p-3 border rounded-lg   focus:ring-2 outline-none" />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">Zip Code</label>
                            <input {...register("zipCode")} className="w-full p-3 border rounded-lg   focus:ring-2 outline-none" />
                            {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-6 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-lg transition"
                    >
                        {submitting ? 'Processing Payment...' : 'Confirm Order & Pay'}
                    </button>
                </form>
            </div>

            <div className="md:w-1/3">
                <div className="bg-gray-50  p-6 rounded-2xl shadow-sm border  sticky top-24">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600 ">{item.quantity} x {item.name}</span>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t  pt-4 flex justify-between">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-extrabold text-primary-600">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
