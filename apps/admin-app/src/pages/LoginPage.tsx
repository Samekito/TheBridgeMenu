import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/adminApi';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            navigate('/', { replace: true });
        },
        onError: (error: any) => {
            setErrorMsg(error.response?.data?.message || 'Invalid credentials');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-800/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-slate-800/50 overflow-hidden relative z-10">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-white">Admin Portal</h2>
                        <p className="text-slate-400 mt-2">The Bridge Hotel Management</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium text-center">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors focus:bg-slate-800 outline-none placeholder:text-slate-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@thebridge.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-700 bg-slate-800/50 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors focus:bg-slate-800 outline-none placeholder:text-slate-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.3)] text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-orange-500 transition-colors disabled:opacity-70"
                        >
                            {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
