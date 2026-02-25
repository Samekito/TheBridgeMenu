import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUser, fetchMenuItems, logout, createCategory, updateCategory, deleteCategory } from '../api/adminApi';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Loader2, UtensilsCrossed, ShieldAlert, Settings, LayoutDashboard, ShoppingBag, FolderPlus, Trash2, X, Menu, History } from 'lucide-react';
import MenuItemFormModal from '../components/MenuItemFormModal';
import SettingsPage from './SettingsPage';
import OrdersView from './OrdersView';
import AuditLogsView from './AuditLogsView';
import type { Category } from '@the-bridge-menu/shared-types';
import { getImageUrl } from '@the-bridge-menu/shared-types/utils';

export default function DashboardPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const { data: user } = useQuery({ queryKey: ['user'], queryFn: getUser });
    const { data: categories, isLoading } = useQuery({ queryKey: ['menu'], queryFn: fetchMenuItems });

    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; name: string } | null>(null);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [currentView, setCurrentView] = useState<'menu' | 'settings' | 'orders' | 'logs'>('orders');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear();
            navigate('/login');
        }
    });

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsMenuModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsMenuModalOpen(true);
    };

    const createCategoryMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu'] });
            setIsCategoryModalOpen(false);
            setNewCategoryName('');
            setEditingCategory(null);
        }
    });

    const updateCategoryMutation = useMutation({
        mutationFn: ({ id, name }: { id: number; name: string }) => updateCategory(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu'] });
            setIsCategoryModalOpen(false);
            setNewCategoryName('');
            setEditingCategory(null);
        }
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['menu'] });
             setCategoryToDelete(null);
        }
    });

    const handleSaveCategory = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            if (editingCategory) {
                updateCategoryMutation.mutate({ id: editingCategory.id, name: newCategoryName.trim() });
            } else {
                createCategoryMutation.mutate(newCategoryName.trim());
            }
        }
    };

    const renderView = () => {
        if (currentView === 'menu') {
            return (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <h1 className="text-2xl font-bold text-white">Menu Management</h1>
                        <div className="flex flex-wrap gap-2">
                            {user?.role === 'super-admin' && (
                                <button 
                                    onClick={() => { setEditingCategory(null); setNewCategoryName(''); setIsCategoryModalOpen(true); }}
                                    className="flex-1 sm:flex-none justify-center bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                >
                                    <FolderPlus className="w-4 h-4" /> Add Category
                                </button>
                            )}
                            <button 
                                onClick={handleAddNew}
                                className="flex-1 sm:flex-none justify-center bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Item
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>
                    ) : (
                        <div className="bg-slate-900/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden border border-slate-800/50 relative">
                            {categories?.map(({ menu_items = [], ...category }: Category & { menu_items?: any[] }) => (
                                <div key={category.id} className="border-b border-slate-800 last:border-b-0">
                                    <div className="bg-slate-800/50 px-4 sm:px-6 py-3 border-b border-slate-700 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 group/cat">
                                        <h3 className="font-semibold text-white text-lg flex items-center gap-3">
                                            {category.name}
                                            {user?.role === 'super-admin' && (
                                                <div className="sm:opacity-0 group-hover/cat:opacity-100 flex items-center gap-1 transition-all">
                                                    <button 
                                                        onClick={() => { setEditingCategory({ id: category.id, name: category.name }); setNewCategoryName(category.name); setIsCategoryModalOpen(true); }}
                                                        className="p-1 text-slate-400 hover:text-white transition-all rounded hover:bg-slate-700"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setCategoryToDelete({ id: category.id, name: category.name })}
                                                        className="p-1 text-slate-400 hover:text-red-500 transition-all rounded hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </h3>
                                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">{menu_items.length} items</span>
                                    </div>
                                    
                                    {menu_items.length === 0 ? (
                                        <div className="p-6 text-center text-slate-400 text-sm">No items in this category.</div>
                                    ) : (
                                        <ul className="divide-y divide-slate-800/50">
                                            {menu_items.map((item: any) => (
                                                <li key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors group">
                                                    <div className="flex items-center gap-4 flex-1">
                                                        <div className="w-16 h-16 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                                                            {item.image_url ? (
                                                                <img 
                                                                src={getImageUrl(item.image_url) ?? ''} 
                                                                    alt={item.name} 
                                                                    className="w-full h-full object-cover" 
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-400">No Img</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-white flex items-center gap-2">
                                                                {item.name}
                                                                {!item.is_available && <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Sold Out</span>}
                                                            </h4>
                                                            <p className="text-sm text-slate-400 line-clamp-1">{item.description}</p>
                                                            <p className="text-white font-semibold mt-1">₦ {Number(item.price).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    >
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
        }
        
        if (currentView === 'orders') {
            return <OrdersView currentUser={user} />;
        }
        
        if (currentView === 'logs') {
            return <AuditLogsView currentUser={user} />;
        }
        
        return <SettingsPage currentUser={user} />;
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden text-slate-100">
            {/* Ambient Background Glows */}
            <div className="fixed top-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-400/10 blur-[100px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none z-0"></div>

            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <UtensilsCrossed className="w-6 h-6 text-white" />
                            <span className="font-bold text-lg text-white">The Bridge Admin</span>
                            {user?.role === 'super-admin' && (
                                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full hidden sm:flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3" /> Super Admin
                                </span>
                            )}
                        </div>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden sm:flex items-center space-x-4">
                            <button 
                                onClick={() => setCurrentView('orders')}
                                className={`text-sm font-medium transition-colors flex items-center gap-2 p-2 rounded-lg ${currentView === 'orders' ? 'text-orange-500 bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <ShoppingBag className="w-4 h-4" /> 
                                <span>Orders</span>
                            </button>
                            <button 
                                onClick={() => setCurrentView('menu')}
                                className={`text-sm font-medium transition-colors flex items-center gap-2 p-2 rounded-lg ${currentView === 'menu' ? 'text-orange-500 bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <LayoutDashboard className="w-4 h-4" /> 
                                <span>Menu</span>
                            </button>
                            <button 
                                onClick={() => setCurrentView('settings')}
                                className={`text-sm font-medium transition-colors flex items-center gap-2 p-2 rounded-lg ${currentView === 'settings' ? 'text-orange-500 bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <Settings className="w-4 h-4" /> 
                                <span>Settings</span>
                            </button>
                            {user?.role === 'super-admin' && (
                                <button 
                                    onClick={() => setCurrentView('logs')}
                                    className={`text-sm font-medium transition-colors flex items-center gap-2 p-2 rounded-lg ${currentView === 'logs' ? 'text-orange-500 bg-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
                                >
                                    <History className="w-4 h-4" /> 
                                    <span>Audit Logs</span>
                                </button>
                            )}
                            <div className="w-px h-6 bg-slate-700 mx-2"></div>
                            <button 
                                onClick={() => logoutMutation.mutate()}
                                className="flex items-center gap-2 p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center sm:hidden">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 -mr-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-2 shadow-2xl absolute w-full max-h-[calc(100vh-4rem)] overflow-y-auto">
                        <button 
                            onClick={() => { setCurrentView('orders'); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${currentView === 'orders' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
                        >
                            <ShoppingBag className="w-5 h-5" /> Orders
                        </button>
                        <button 
                            onClick={() => { setCurrentView('menu'); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${currentView === 'menu' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
                        >
                            <LayoutDashboard className="w-5 h-5" /> Menu
                        </button>
                        <button 
                            onClick={() => { setCurrentView('settings'); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${currentView === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
                        >
                            <Settings className="w-5 h-5" /> Settings
                        </button>
                        {user?.role === 'super-admin' && (
                            <button 
                                onClick={() => { setCurrentView('logs'); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${currentView === 'logs' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
                            >
                                <History className="w-5 h-5" /> Audit Logs
                            </button>
                        )}
                        <div className="w-full h-px bg-slate-800 my-2"></div>
                        <button 
                            onClick={() => { setIsMobileMenuOpen(false); logoutMutation.mutate(); }}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5" /> Logout
                        </button>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 relative z-10">
                {renderView()}
            </main>

            {/* Modal */}
            <MenuItemFormModal 
                isOpen={isMenuModalOpen} 
                onClose={() => setIsMenuModalOpen(false)} 
                item={editingItem}
                categories={categories || []}
            />
            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                            <button onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); setNewCategoryName(''); }} className="text-slate-500 hover:text-slate-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveCategory} className="p-6">
                            <div className="mb-6">
                                <label htmlFor="categoryName" className="block text-sm font-medium text-slate-300 mb-1">Category Name</label>
                                <input 
                                    id="categoryName"
                                    type="text" 
                                    required 
                                    autoFocus
                                    className="block w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none placeholder-slate-500" 
                                    value={newCategoryName} 
                                    onChange={e => setNewCategoryName(e.target.value)} 
                                    placeholder="e.g. Chinese Food"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); setNewCategoryName(''); }}
                                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending || !newCategoryName.trim()}
                                    className="bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-70 transition-colors"
                                >
                                    {(createCategoryMutation.isPending || updateCategoryMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingCategory ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {categoryToDelete && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-red-500/30 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5 text-red-500">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Category?</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Are you sure you want to delete <span className="text-white font-semibold">"{categoryToDelete.name}"</span>?<br/>
                                <span className="text-red-400 font-medium block mt-2">This will permanently delete all menu items inside it. This action cannot be undone.</span>
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={() => setCategoryToDelete(null)}
                                    disabled={deleteCategoryMutation.isPending}
                                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => deleteCategoryMutation.mutate(categoryToDelete.id)}
                                    disabled={deleteCategoryMutation.isPending}
                                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleteCategoryMutation.isPending ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                                    ) : (
                                        <><Trash2 className="w-4 h-4" /> Delete Category</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
