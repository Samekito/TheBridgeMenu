import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';

import { type MenuItem } from '@the-bridge-menu/shared-types';
import { getImageUrl } from '@the-bridge-menu/shared-types/utils';

export function MenuCard({ item, index }: Readonly<{ item: MenuItem; index: number }>) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            menu_item_id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image_url: item.image_url
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(249,115,22,0.15)] transition-all duration-500 border border-slate-700/50 hover:border-orange-500/20 bg-slate-800 flex flex-col ${item.is_available ? '' : 'opacity-60 grayscale'}`}
        >
            <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                {item.image_url ? (
                    <img 
                        src={getImageUrl(item.image_url) ?? ''} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                )}
                {!item.is_available && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        Sold Out
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <span className="text-white font-bold text-xl drop-shadow-lg tracking-tight">₦ {Number(item.price).toLocaleString()}</span>
                </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-lg text-white mb-2 leading-tight">{item.name}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{item.description}</p>
                </div>
                <button 
                    disabled={!item.is_available}
                    onClick={handleAddToCart}
                    className="relative overflow-hidden mt-4 w-full bg-orange-600 text-white font-medium py-2.5 rounded-lg hover:bg-orange-500 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed flex sm:hidden sm:group-hover:flex items-center justify-center gap-2 animate-in fade-in zoom-in group/btn"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 w-[200%] -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] transition-opacity"></div>
                    <ShoppingBag className="relative w-4 h-4" />
                    <span className="relative">Add to Order</span>
                </button>
            </div>
        </motion.div>
    );
}
