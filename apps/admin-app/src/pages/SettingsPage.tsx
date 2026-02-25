import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdmins, createAdmin, deleteAdmin, updatePassword } from '../api/adminApi';
import { ShieldAlert, Trash2, UserPlus, KeyRound, Loader2 } from 'lucide-react';

export default function SettingsPage({ currentUser }: { currentUser: any }) {
    const queryClient = useQueryClient();
    const [adminToDelete, setAdminToDelete] = useState<{ id: number; name: string } | null>(null);
    
    // Admins Tab State
    const { data: admins, isLoading: loadingAdmins } = useQuery({ 
        queryKey: ['admins'], 
        queryFn: getAdmins,
        enabled: currentUser?.role === 'super-admin' 
    });
    
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [newAdminName, setNewAdminName] = useState('');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [adminError, setAdminError] = useState('');

    // Password Tab State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const createAdminMutation = useMutation({
        mutationFn: createAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] });
            setNewAdminEmail('');
            setNewAdminName('');
            setNewAdminPassword('');
            setAdminError('');
        },
        onError: (err: any) => setAdminError(err.response?.data?.message || 'Failed to create admin')
    });

    const deleteAdminMutation = useMutation({
        mutationFn: deleteAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] });
            setAdminToDelete(null);
        }
    });

    const updatePasswordMutation = useMutation({
        mutationFn: updatePassword,
        onSuccess: () => {
            setPasswordSuccess('Password updated successfully!');
            setPasswordError('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setPasswordSuccess(''), 3000);
        },
        onError: (err: any) => {
            setPasswordError(err.response?.data?.message || 'Failed to update password');
            setPasswordSuccess('');
        }
    });

    const handleCreateAdmin = (e: React.FormEvent) => {
        e.preventDefault();
        createAdminMutation.mutate({ name: newAdminName, email: newAdminEmail, password: newAdminPassword });
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }
        updatePasswordMutation.mutate({ 
            current_password: currentPassword, 
            new_password: newPassword,
            new_password_confirmation: confirmPassword
        });
    };

    return (
        <>
            <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-2xl font-bold text-white">Account Settings</h2>

                {/* Change Password Section */}
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-slate-800/50 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-800/30 flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-slate-400" />
                        <h3 className="text-lg font-semibold text-white">Change Password</h3>
                    </div>
                    <div className="p-6">
                        {passwordError && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{passwordError}</div>}
                        {passwordSuccess && <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-lg">{passwordSuccess}</div>}
                        
                        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
                                <input id="currentPassword" type="password" required className="block w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
                                    value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                                <input id="newPassword" type="password" required minLength={8} className="block w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
                                    value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
                                <input id="confirmPassword" type="password" required minLength={8} className="block w-full px-3 py-2 border border-slate-700 bg-slate-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" 
                                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            </div>
                            <button 
                                type="submit" 
                                disabled={updatePasswordMutation.isPending}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] disabled:opacity-70 flex items-center gap-2 transition-colors"
                            >
                                {updatePasswordMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Update Password
                            </button>
                        </form>
                    </div>
                </div>

                {/* Super Admin Section: Manage Team */}
                {currentUser?.role === 'super-admin' && (
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-slate-800/50 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-800/50 bg-indigo-500/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                                <h3 className="text-lg font-semibold text-indigo-100">Manage Administrator Team</h3>
                            </div>
                        </div>
                        
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                            {/* List Admins */}
                            <div>
                                <h4 className="font-medium text-white mb-4">Current Administrators</h4>
                                {loadingAdmins ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                                ) : (
                                    <ul className="space-y-3">
                                        {admins?.map((admin: any) => (
                                            <li key={admin.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                                <div>
                                                    <p className="font-medium text-sm text-white flex items-center gap-2">
                                                        {admin.name}
                                                        {admin.role === 'super-admin' && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded tracking-wide uppercase font-bold">Super</span>}
                                                    </p>
                                                    <p className="text-xs text-slate-400">{admin.email}</p>
                                                </div>
                                                {admin.id !== currentUser.id && admin.role !== 'super-admin' && (
                                                    <button 
                                                        onClick={() => setAdminToDelete({ id: admin.id, name: admin.name })}
                                                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Add Admin */}
                            <div className="pt-6 md:pt-0 md:pl-8">
                                <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                                    <UserPlus className="w-4 h-4 text-slate-400" /> Add New Admin
                                </h4>
                                {adminError && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{adminError}</div>}
                                
                                <form onSubmit={handleCreateAdmin} className="space-y-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                                        <input id="fullName" type="text" required className="block w-full px-3 py-1.5 border border-slate-700 bg-slate-800 text-white rounded outline-none focus:ring-2 focus:ring-orange-500 text-sm" 
                                            value={newAdminName} onChange={e => setNewAdminName(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="emailAddress" className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                                        <input id="emailAddress" type="email" required className="block w-full px-3 py-1.5 border border-slate-700 bg-slate-800 text-white rounded outline-none focus:ring-2 focus:ring-orange-500 text-sm" 
                                            value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="tempPassword" className="block text-xs font-medium text-slate-400 mb-1">Temporary Password</label>
                                        <input id="tempPassword" type="password" required minLength={8} className="block w-full px-3 py-1.5 border border-slate-700 bg-slate-800 text-white rounded outline-none focus:ring-2 focus:ring-orange-500 text-sm" 
                                            value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={createAdminMutation.isPending}
                                        className="w-full bg-slate-800 text-white border border-slate-700 px-4 py-2 rounded font-medium hover:bg-slate-700 disabled:opacity-70 text-sm flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {createAdminMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />} Create Account
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Admin Delete Confirmation Modal */}
            {adminToDelete && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-red-500/30 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 sm:p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5 text-red-500">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Admin?</h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Are you sure you want to remove <span className="text-white font-semibold">"{adminToDelete.name}"</span> from the team?
                                <span className="text-red-400 font-medium block mt-2">Their access will be immediately revoked.</span>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button 
                                    onClick={() => setAdminToDelete(null)}
                                    disabled={deleteAdminMutation.isPending}
                                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => deleteAdminMutation.mutate(adminToDelete.id)}
                                    disabled={deleteAdminMutation.isPending}
                                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {deleteAdminMutation.isPending ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Removing...</>
                                    ) : (
                                        <><Trash2 className="w-4 h-4" /> Remove Admin</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
