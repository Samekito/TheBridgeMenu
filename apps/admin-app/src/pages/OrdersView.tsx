import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, clearOrder } from '../api/adminApi';
import { Loader2, CheckCircle2, ShoppingBag, Clock, Receipt, User } from 'lucide-react';
import type { Order, User as UserType } from '@the-bridge-menu/shared-types';

export default function OrdersView({ currentUser }: { currentUser: UserType }) {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<'pending' | 'cleared'>('pending');

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders', filter],
        queryFn: () => fetchOrders(filter),
        refetchInterval: filter === 'pending' ? 10000 : false // Auto-refresh pending orders every 10s
    });

    const clearMutation = useMutation({
        mutationFn: clearOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
    });

    if (isLoading) {
        return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-slate-900/80 backdrop-blur-xl p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-800/50">
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
                    >
                        Pending Orders
                    </button>
                    <button
                        onClick={() => setFilter('cleared')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'cleared' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
                    >
                        Order History
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {orders?.length === 0 ? (
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-800/50 p-12 text-center flex flex-col items-center">
                        <ShoppingBag className="w-12 h-12 text-slate-700 mb-4" />
                        <h3 className="text-lg font-medium text-white">No {filter} orders</h3>
                        <p className="text-slate-400 text-sm">When customers place orders, they will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {orders?.map((order: Order) => (
                            <div key={order.id} className="bg-slate-900/80 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-slate-800/50 overflow-hidden flex flex-col">
                                <div className={`px-6 py-4 border-b border-slate-800/50 flex justify-between items-center ${order.status === 'pending' ? 'bg-amber-500/10' : 'bg-slate-800/30'}`}>
                                    <div className="flex items-center gap-3">
                                        {order.status === 'pending' ? <Clock className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                        <h3 className="font-semibold text-white flex items-center gap-2">
                                            Order #{order.id}
                                            {order.status === 'pending' && <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">New</span>}
                                        </h3>
                                    </div>
                                    <span className="text-sm text-slate-400">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col">
                                    {/* Customer Detail Banner */}
                                    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 grid-cols-1 md:grid-cols-2">
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <User className="w-4 h-4 text-slate-500" />
                                            <span className="font-medium text-white">{order.customer_name || 'Guest'}</span>
                                        </div>
                                        {order.table_number && (
                                            <div className="flex items-center gap-2 text-sm text-slate-300 before:content-['•'] before:text-slate-600">
                                                <span className="ml-2 font-medium text-white">Table {order.table_number}</span>
                                            </div>
                                        )}
                                        {order.customer_phone && (
                                            <div className="flex items-center gap-2 text-sm text-slate-300 before:content-['•'] before:text-slate-600">
                                                <span className="ml-2 font-medium text-white">{order.customer_phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    <ul className="space-y-3 mb-6 flex-1">
                                        {order.items.map((item: any) => (
                                            <li key={item.id} className="flex justify-between items-start text-sm">
                                                <div className="flex gap-3">
                                                    <span className="font-semibold text-white w-6">{item.quantity}x</span>
                                                    <span className="text-slate-300">{item.menu_item?.name || 'Unknown Item'}</span>
                                                </div>
                                                <span className="text-slate-400">₦ {item.price}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="border-t border-slate-700/50 pt-4 flex justify-between items-center mb-6">
                                        <span className="font-medium text-slate-400">Total</span>
                                        <span className="text-xl font-bold text-white">₦ {Number(order.total_price).toLocaleString()}</span>
                                    </div>

                                    {order.status === 'pending' ? (
                                        <button
                                            onClick={() => clearMutation.mutate(order.id)}
                                            disabled={clearMutation.isPending}
                                            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]"
                                        >
                                            {clearMutation.isPending && clearMutation.variables === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Mark as Cleared
                                        </button>
                                    ) : (
                                        <div className="bg-slate-800/50 p-3 rounded-lg text-sm text-slate-400 flex items-center justify-center gap-2 border border-slate-700/50">
                                            <Receipt className="w-4 h-4" />
                                            Cleared on {new Date(order.updated_at).toLocaleDateString()}
                                            {(currentUser?.role === 'super-admin' && order.cleared_by_admin) && (
                                                <span className="text-indigo-400 font-medium ml-1">by {order.cleared_by_admin.name}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
