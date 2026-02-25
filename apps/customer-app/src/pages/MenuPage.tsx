import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMenu } from '../api/menuApi';
import { MenuCard } from '../components/MenuCard';
import { useCart } from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';
import { Coffee, Utensils, Wine, Globe, Loader2, Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Category } from '@the-bridge-menu/shared-types';

const getIconForCategory = (slug: string) => {
    switch (slug) {
        case 'breakfast-menu': return <Coffee className="w-5 h-5" />;
        case 'national-dishes': return <Utensils className="w-5 h-5" />;
        case 'continental-dishes': return <Globe className="w-5 h-5" />;
        case 'drinks': return <Wine className="w-5 h-5" />;
        default: return <Utensils className="w-5 h-5" />;
    }
};

export default function MenuPage() {
    const { data: categories, isLoading, isError } = useQuery({
        queryKey: ['menu'],
        queryFn: fetchMenu
    });

    const { totalItems } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-slate-800" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-500">
                Failed to load the menu. Please try again later.
            </div>
        );
    }

    // Filter categories based on active tab and search query
    const filteredCategories = categories?.map((cat: Category & { menu_items?: any[] }) => ({
        ...cat,
        menu_items: cat.menu_items?.filter((item: any) => 
            item.is_available &&
            (item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (item.description?.toLowerCase().includes(searchQuery.toLowerCase())))
        ) || []
    })).filter((cat: Category & { menu_items: any[] }) => 
        (activeTab === 'all' || cat.slug === activeTab) && cat.menu_items.length > 0
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-400/5 blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none z-0"></div>

            {/* Header / Fixed Nav */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                        className="sm:hidden p-2 -ml-2 mr-2 text-slate-400 hover:bg-slate-800 rounded-lg"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <Link to="/" className="font-bold text-xl tracking-tight hidden sm:flex items-center gap-2">
                        <Utensils className="w-6 h-6 text-orange-500" />
                        The Bridge
                    </Link>
                    
                    <div className="flex-1 max-w-md mx-2 sm:mx-8">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-slate-300">
                                <Search className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-slate-700/50 rounded-full leading-5 bg-slate-800/50 placeholder-slate-500 text-white focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent sm:text-sm transition-all"
                                placeholder="Search dishes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* Cart Trigger */}
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-slate-300 hover:text-white bg-slate-800/80 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-slate-700 rounded-full transition-all ml-2 sm:ml-4 group"
                    >
                        <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </div>

                {/* Desktop Categories Tabs */}
                <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex justify-center space-x-8 overflow-x-auto pt-2 pb-0 hide-scrollbar" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`relative whitespace-nowrap py-4 px-1 font-medium text-sm flex items-center transition-all ${activeTab === 'all' ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            All Menu
                            {activeTab === 'all' && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                            )}
                        </button>
                        {categories?.map((category: any) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveTab(category.slug)}
                                className={`relative whitespace-nowrap py-4 px-1 font-medium text-sm flex items-center gap-2 transition-all ${activeTab === category.slug ? 'text-orange-500' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                {getIconForCategory(category.slug)}
                                {category.name}
                                {activeTab === category.slug && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-2 shadow-2xl absolute w-full max-h-[calc(100vh-4rem)] overflow-y-auto">
                        <button 
                            onClick={() => { setActiveTab('all'); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
                        >
                            <Utensils className="w-5 h-5" /> All Menu
                        </button>
                        {categories?.map((category: any) => (
                            <button 
                                key={category.id}
                                onClick={() => { setActiveTab(category.slug); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === category.slug ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
                            >
                                {getIconForCategory(category.slug)} {category.name}
                            </button>
                        ))}
                    </div>
                )}
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[88px] sm:pt-[140px]">
                {filteredCategories?.length > 0 ? (
                    <div className="space-y-16">
                        {filteredCategories.map((category: any) => (
                            <section key={category.id} className="scroll-mt-32">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                        {category.name}
                                    </h2>
                                    {category.description && (
                                        <p className="text-slate-400 mt-1">{category.description}</p>
                                    )}
                                </div>
                                <motion.div 
                                    layout
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                >
                                    <AnimatePresence>
                                        {category.menu_items.map((item: any, idx: number) => (
                                            <MenuCard key={item.id} item={item} index={idx} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        <Search className="w-12 h-12 mx-auto mb-4 text-slate-700" />
                        <h3 className="text-lg font-medium text-white">No dishes found</h3>
                        <p>Try adjusting your search query.</p>
                    </div>
                )}
            </main>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
}
