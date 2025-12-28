import React from 'react';
import {
    LayoutDashboard, Users, Star, Film, ListOrdered, Settings, LogOut
} from 'lucide-react';

const AdminSidebar = ({ activeTab, onTabChange }) => {
    const menuItems = [
        { id: 'overview', name: 'Overview', icon: LayoutDashboard },
        { id: 'users', name: 'User Management', icon: Users },
        { id: 'reviews', name: 'Review Moderation', icon: Star },
        { id: 'watchlist', name: 'Watchlist Monitor', icon: Film },
        { id: 'logs', name: 'Logs & Analytics', icon: ListOrdered },
    ];

    return (
        <div className="bg-[#121212] rounded-2xl border border-gray-800 p-4 sticky top-24 shadow-2xl">
            <div className="mb-6 px-4">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Admin Control</h3>
            </div>

            <div className="space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id
                                ? 'bg-cinema-red text-white shadow-lg shadow-red-900/20 translate-x-1'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} className={activeTab === item.id ? 'animate-pulse' : ''} />
                        <span className="font-semibold text-sm">{item.name}</span>
                    </button>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
                <button
                    onClick={() => window.location.href = '/'}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-900/10 hover:text-red-500 transition-all duration-300"
                >
                    <Settings size={20} />
                    <span className="font-semibold text-sm">System Settings</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
