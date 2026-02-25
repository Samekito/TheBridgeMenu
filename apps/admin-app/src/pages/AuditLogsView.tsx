import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs } from '../api/adminApi';
import { Loader2, History, User, Calendar, Tag, Utensils, PlusCircle, RefreshCw, Trash2 } from 'lucide-react';
import type { AuditLogItem, User as UserType } from '@the-bridge-menu/shared-types';

export default function AuditLogsView({ currentUser }: { currentUser: UserType }) {
    const { data: logs, isLoading } = useQuery({ queryKey: ['audit-logs'], queryFn: fetchAuditLogs });

    if (currentUser?.role !== 'super-admin') {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <History className="w-12 h-12 mb-4 text-slate-700" />
                <h3 className="text-xl font-bold text-white">Access Denied</h3>
                <p>Only Super Admins can view the creation history.</p>
            </div>
        );
    }

    if (isLoading) {
        return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>;
    }

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'created':
                return <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20"><PlusCircle className="w-3 h-3" /> Created</span>;
            case 'updated':
                return <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20"><RefreshCw className="w-3 h-3" /> Updated</span>;
            case 'deleted':
                return <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/20"><Trash2 className="w-3 h-3" /> Deleted</span>;
            default:
                return <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-500/20 text-slate-400 px-2 py-0.5 rounded">{action}</span>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-lg">
                    <History className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
                    <p className="text-slate-400 text-sm">Review who created, updated, or deleted menu items and categories.</p>
                </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden border border-slate-800/50 relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 border-b border-slate-700/50">
                                <th className="p-4 text-sm font-medium text-slate-300">Action & Item</th>
                                <th className="p-4 text-sm font-medium text-slate-300">Admin Responsible</th>
                                <th className="p-4 text-sm font-medium text-slate-300">Date Logged</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {(!logs || logs.length === 0) ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-500 italic">No audit history found yet.</td>
                                </tr>
                            ) : (
                                logs.map((log: AuditLogItem) => (
                                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    {log.entity_type === 'Category' ? (
                                                        <Tag className="w-5 h-5 text-indigo-400" />
                                                    ) : (
                                                        <Utensils className="w-5 h-5 text-orange-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-semibold text-white">{log.entity_name}</p>
                                                        {getActionBadge(log.action)}
                                                    </div>
                                                    <p className="text-xs text-slate-400">
                                                        {log.entity_type} {log.entity_type === 'Menu Item' && log.category_name && `in ${log.category_name}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{log.user?.name || 'Unknown User'}</p>
                                                    <p className="text-xs text-slate-500">{log.user?.email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-400">
                                            <span className="flex items-center gap-2 bg-slate-800/50 px-2.5 py-1 rounded w-fit border border-slate-700/50 whitespace-nowrap">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(log.created_at).toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
