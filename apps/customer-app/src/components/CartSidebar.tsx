import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';
import { submitOrder } from '../api/menuApi';
import { useMutation } from '@tanstack/react-query';
import { getImageUrl } from '@the-bridge-menu/shared-types/utils';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
    const { items, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
    const [customerName, setCustomerName] = useState('');
    const [tableNumber, setTableNumber] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const orderMutation = useMutation({
        mutationFn: submitOrder,
        onSuccess: () => {
            setIsSuccess(true);
            clearCart();
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 3000);
        },
        onError: (error: any) => {
            setErrorMsg(error.response?.data?.message || 'Failed to submit order.');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        if (items.length === 0) return;

        const payload = {
            customer_name: customerName,
            table_number: tableNumber,
            items: items.map(i => ({
                menu_item_id: i.menu_item_id,
                quantity: i.quantity
            }))
        };

        orderMutation.mutate(payload);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                <ShoppingBag className="w-5 h-5 text-orange-500" /> Your Order
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isSuccess ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                                <CheckCircle2 className="w-16 h-16 text-green-500 animate-in zoom-in" />
                                <h3 className="text-2xl font-bold text-white">Order Received!</h3>
                                <p className="text-slate-400">Your order has been sent to the kitchen. It will be ready shortly.</p>
                            </div>
                        ) : (
                            <>
                                {/* Cart Items */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                    {items.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                                            <ShoppingBag className="w-12 h-12 opacity-20" />
                                            <p>Your cart is empty</p>
                                        </div>
                                    ) : (
                                        items.map(item => (
                                            <div key={item.menu_item_id} className="flex gap-4 group">
                                                <div className="w-20 h-20 rounded-xl bg-slate-800 border border-slate-700/50 overflow-hidden flex-shrink-0">
                                                    {item.image_url ? (
                                                        <img src={getImageUrl(item.image_url) ?? ''} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-600">No img</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start gap-2">
                                                            <h4 className="font-medium text-white leading-tight">{item.name}</h4>
                                                            <button onClick={() => removeFromCart(item.menu_item_id)} className="text-slate-500 hover:text-red-500 p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-orange-500 font-semibold mt-1">₦ {Number(item.price).toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            onClick={() => updateQuantity(item.menu_item_id, -1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="font-medium w-4 text-center text-sm text-slate-200">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.menu_item_id, 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Checkout Footer */}
                                {items.length > 0 && (
                                    <div className="border-t border-slate-800 p-6 bg-slate-900/80 backdrop-blur-xl">
                                        {errorMsg && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{errorMsg}</div>}

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-1">Your Name</label>
                                                    <input
                                                        type="text"
                                                        className="block w-full px-3 py-2 text-sm text-white bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none placeholder-slate-500 transition-shadow"
                                                        value={customerName}
                                                        onChange={e => setCustomerName(e.target.value)}
                                                        placeholder="Optional"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-400 mb-1">Table No.</label>
                                                    <input
                                                        type="text"
                                                        className="block w-full px-3 py-2 text-sm text-white bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none placeholder-slate-500 transition-shadow"
                                                        value={tableNumber}
                                                        onChange={e => setTableNumber(e.target.value)}
                                                        placeholder="Optional"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pb-4 pt-2">
                                                <span className="text-slate-400 font-medium">Total Amount</span>
                                                <span className="text-2xl font-bold text-white">₦ {totalAmount.toLocaleString()}</span>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={orderMutation.isPending}
                                                className="relative overflow-hidden w-full bg-orange-600 text-white font-medium py-3.5 rounded-xl hover:bg-orange-500 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                                            >
                                                {!orderMutation.isPending && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 w-[200%] -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] transition-opacity"></div>}
                                                {orderMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin relative" /> : <span className="relative">Submit Order</span>}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
