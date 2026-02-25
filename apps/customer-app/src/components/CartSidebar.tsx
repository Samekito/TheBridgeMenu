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
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                                <ShoppingBag className="w-5 h-5" /> Your Order
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isSuccess ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                                <h3 className="text-2xl font-bold text-slate-900">Order Received!</h3>
                                <p className="text-slate-500">Your order has been sent to the kitchen. It will be ready shortly.</p>
                            </div>
                        ) : (
                            <>
                                {/* Cart Items */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {items.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                            <ShoppingBag className="w-12 h-12 opacity-50" />
                                            <p>Your cart is empty</p>
                                        </div>
                                    ) : (
                                        items.map(item => (
                                            <div key={item.menu_item_id} className="flex gap-4">
                                                <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                                    {item.image_url ? (
                                                        <img src={getImageUrl(item.image_url) ?? ''} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">No img</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start gap-2">
                                                            <h4 className="font-medium text-slate-900 leading-tight">{item.name}</h4>
                                                            <button onClick={() => removeFromCart(item.menu_item_id)} className="text-slate-400 hover:text-red-500 p-1">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-slate-900 font-semibold mt-1">₦ {Number(item.price).toLocaleString()}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button 
                                                            onClick={() => updateQuantity(item.menu_item_id, -1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="font-medium w-4 text-center text-sm">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.menu_item_id, 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
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
                                    <div className="border-t border-slate-100 p-6 bg-slate-50">
                                        {errorMsg && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{errorMsg}</div>}
                                        
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">Your Name</label>
                                                    <input 
                                                        type="text" 
                                                        className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                                                        value={customerName}
                                                        onChange={e => setCustomerName(e.target.value)}
                                                        placeholder="Optional"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-700 mb-1">Table No.</label>
                                                    <input 
                                                        type="text" 
                                                        className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900"
                                                        value={tableNumber}
                                                        onChange={e => setTableNumber(e.target.value)}
                                                        placeholder="Optional"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pb-4 pt-2">
                                                <span className="text-slate-500 font-medium">Total Amount</span>
                                                <span className="text-2xl font-bold text-slate-900">₦ {totalAmount.toLocaleString()}</span>
                                            </div>

                                            <button 
                                                type="submit" 
                                                disabled={orderMutation.isPending}
                                                className="w-full bg-slate-900 text-white font-medium py-3.5 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                            >
                                                {orderMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Order'}
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
