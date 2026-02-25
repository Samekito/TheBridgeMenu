import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '@the-bridge-menu/shared-types';
export type { CartItem } from '@the-bridge-menu/shared-types';

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    updateQuantity: (id: number, delta: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('bridge_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('bridge_cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: CartItem) => {
        setItems(current => {
            const existing = current.find(i => i.menu_item_id === newItem.menu_item_id);
            if (existing) {
                return current.map(i => 
                    i.menu_item_id === newItem.menu_item_id 
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                );
            }
            return [...current, newItem];
        });
    };

    const updateQuantity = (id: number, delta: number) => {
        setItems(current => current.map(item => {
            if (item.menu_item_id === id) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id: number) => {
        setItems(current => current.filter(i => i.menu_item_id !== id));
    };

    const clearCart = () => setItems([]);

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items, addToCart, updateQuantity, removeFromCart, clearCart, totalAmount, totalItems
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
