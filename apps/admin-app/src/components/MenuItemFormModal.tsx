import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveMenuItem, uploadImage, deleteMenuItem } from '../api/adminApi';
import { X, Upload, Loader2, Trash2, UtensilsCrossed, ShieldAlert } from 'lucide-react';

interface MenuItemFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: any;
    categories: any[];
}

export default function MenuItemFormModal({ isOpen, onClose, item, categories }: MenuItemFormModalProps) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue } = useForm();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    useEffect(() => {
        if (item && isOpen) {
            setValue('name', item.name);
            setValue('category_id', item.category_id);
            setValue('description', item.description || '');
            setValue('price', item.price);
            setValue('is_available', item.is_available);
            setImagePreview(item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `http://localhost:8000${item.image_url}`) : null);
        } else if (isOpen) {
            reset();
            setImageFile(null);
            setImagePreview(null);
            setIsConfirmingDelete(false);
            if (categories.length > 0) {
                setValue('category_id', categories[0].id);
            }
        }
    }, [item, isOpen, reset, setValue, categories]);

    const saveMutation = useMutation({
        mutationFn: (data: any) => saveMenuItem(item?.id || null, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu'] });
            onClose();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteMenuItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['menu'] });
            setIsConfirmingDelete(false);
            onClose();
        }
    });

    const onSubmit = async (data: any) => {
        let imageUrl = item?.image_url;
        
        if (imageFile) {
            setIsUploading(true);
            try {
                imageUrl = await uploadImage(imageFile);
            } catch (err) {
                console.error("Image upload failed", err);
                setIsUploading(false);
                return;
            }
            setIsUploading(false);
        }

        const payload = {
            ...data,
            price: parseFloat(data.price),
            is_available: data.is_available === true || data.is_available === 'true' || data.is_available === 1,
            image_url: imageUrl,
        };

        saveMutation.mutate(payload);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:bg-slate-800 hover:text-slate-300 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {item ? 'Edit Menu Item' : 'Add New Item'}
                    </h2>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Item Image</label>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <UtensilsCrossed className="w-8 h-8 text-slate-300" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-300 hover:bg-slate-700 cursor-pointer w-fit transition-colors">
                                        <Upload className="w-4 h-4" />
                                        Choose File
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    </label>
                                    <p className="mt-2 text-xs text-slate-500">PNG, JPG, WEBP up to 2MB</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                                <input {...register('name', { required: true })} className="block w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                                <select {...register('category_id')} className="block w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                                    {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                            <textarea {...register('description')} rows={3} className="block w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"></textarea>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Price (₦)</label>
                                <input type="number" step="0.01" {...register('price', { required: true })} className="block w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                            </div>
                            <div className="pb-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" {...register('is_available')} className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-orange-500" />
                                    <span className="text-sm font-medium text-slate-300">Currently Available in Menu</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                            {item ? (
                                <button 
                                    type="button" 
                                    onClick={() => setIsConfirmingDelete(true)}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Item
                                </button>
                            ) : <div></div>}
                            
                            <div className="flex gap-3">
                                <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-300 font-medium bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">Cancel</button>
                                <button 
                                    type="submit" 
                                    disabled={saveMutation.isPending || isUploading}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-colors disabled:opacity-70"
                                >
                                    {(saveMutation.isPending || isUploading) && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {item ? 'Save Changes' : 'Create Item'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isConfirmingDelete && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-red-500/30 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5 text-red-500">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Item?</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Are you sure you want to delete <span className="text-white font-semibold">"{item?.name}"</span>?<br/>
                                <span className="text-red-400 font-medium block mt-2">This action cannot be undone.</span>
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={() => setIsConfirmingDelete(false)}
                                    disabled={deleteMutation.isPending}
                                    type="button"
                                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => deleteMutation.mutate(item.id)}
                                    disabled={deleteMutation.isPending}
                                    type="button"
                                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleteMutation.isPending ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                                    ) : (
                                        <><Trash2 className="w-4 h-4" /> Delete Item</>
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
