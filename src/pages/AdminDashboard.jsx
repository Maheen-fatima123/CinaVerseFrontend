import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useStore } from '../context/StoreContext';
import UserSidebar from '../components/dashboards/UserSidebar';
import OverviewTab from '../components/dashboards/admin/OverviewTab';
import UserManagementTab from '../components/dashboards/admin/UserManagementTab';
import ReviewModerationTab from '../components/dashboards/admin/ReviewModerationTab';
import WatchlistMonitoringTab from '../components/dashboards/admin/WatchlistMonitoringTab';
import LogsAnalyticsTab from '../components/dashboards/admin/LogsAnalyticsTab';
import SettingsTab from '../components/dashboards/SettingsTab';
import { AlertCircle, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    const {
        user,
        adminGetUsers, adminGetLogs, adminGetWatchlists, adminUpdateUserRole,
        adminDeleteUser, adminGetReviews, adminDeleteReview, adminGetStats
    } = useStore();

    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState({
        users: [],
        logs: { loginLogs: [], apiLogs: [] },
        watchlists: [],
        reviews: [],
        stats: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [u, l, w, r, s] = await Promise.all([
                adminGetUsers(),
                adminGetLogs(),
                adminGetWatchlists(),
                adminGetReviews(),
                adminGetStats().catch(() => ({
                    totalUsers: 0,
                    totalReviews: 0,
                    totalWatchlist: 0,
                    apiCallsToday: 0,
                    activeSubscriptions: 0
                }))
            ]);

            setData({
                users: Array.isArray(u) ? u : [],
                logs: (l && typeof l === 'object' && !Array.isArray(l)) ? l : { loginLogs: [], apiLogs: [] },
                watchlists: Array.isArray(w) ? w : [],
                reviews: Array.isArray(r) ? r : [],
                stats: s || {}
            });
        } catch (e) {
            setError(e.message || 'Access Denied: Administrative privileges required.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, []);

    const handleUpdateRole = async (id, role) => {
        try {
            await adminUpdateUserRole(id, role);
            loadAllData(); // Refresh
        } catch (e) {
            alert(e.message);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
        try {
            await adminDeleteUser(id);
            loadAllData();
        } catch (e) {
            alert(e.message);
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Delete this review?')) return;
        try {
            await adminDeleteReview(id);
            loadAllData();
        } catch (e) {
            alert(e.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--background-color)' }}>
                <Loader2 className="animate-spin text-cinema-red" style={{ color: 'var(--primary-red)' }} size={48} />
                <p className="font-bold uppercase tracking-widest animate-pulse" style={{ color: 'var(--muted-text)' }}>Initializing Admin Engine...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: 'var(--background-color)' }}>
                <div className="bg-red-900/10 border border-red-500/20 p-12 rounded-3xl text-center max-w-lg">
                    <AlertCircle className="text-red-500 mx-auto mb-6" size={64} />
                    <h2 className="text-2xl font-black mb-4" style={{ color: 'var(--text-color)' }}>SECURITY ALERT</h2>
                    <p className="mb-8" style={{ color: 'var(--muted-text)' }}>{error}</p>
                    <button onClick={() => window.location.href = '/'} className="custom-red-btn px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all">
                        Return to Safety
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            <main className="flex-grow-1 pb-5 mt-5" style={{ paddingTop: 64 }}>
                <div className="container py-4">
                    <div className="row g-3">
                        <div className="col-lg-3">
                            <UserSidebar user={user || { role: 'admin' }} activeTab={activeTab} onTabChange={setActiveTab} />
                        </div>

                        <div className="col-lg-9">
                            <div className="transition-all duration-500 ease-in-out">
                                {activeTab === 'overview' && <OverviewTab stats={data.stats} />}
                                {activeTab === 'users' && (
                                    <UserManagementTab
                                        users={data.users}
                                        onUpdateRole={handleUpdateRole}
                                        onDeleteUser={handleDeleteUser}
                                    />
                                )}
                                {activeTab === 'reviews' && (
                                    <ReviewModerationTab
                                        reviews={data.reviews}
                                        onDeleteReview={handleDeleteReview}
                                    />
                                )}
                                {activeTab === 'watchlist' && (
                                    <WatchlistMonitoringTab watchlists={data.watchlists} />
                                )}
                                {activeTab === 'logs' && <LogsAnalyticsTab logs={data.logs} />}
                                {activeTab === 'settings' && <SettingsTab />}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
