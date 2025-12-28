import React, { useState, useEffect } from 'react';
import ParentDashboard from './ParentDashboard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useStore } from '../context/StoreContext';
import UserSidebar from '../components/dashboards/UserSidebar';
import ProfileTab from '../components/dashboards/ProfileTab';
import SubscriptionTab from '../components/dashboards/SubscriptionTab';
import SettingsTab from '../components/dashboards/SettingsTab';

// Admin Tabs
import OverviewTab from '../components/dashboards/admin/OverviewTab';
import UserManagementTab from '../components/dashboards/admin/UserManagementTab';
import ReviewModerationTab from '../components/dashboards/admin/ReviewModerationTab';
import WatchlistMonitoringTab from '../components/dashboards/admin/WatchlistMonitoringTab';
import LogsAnalyticsTab from '../components/dashboards/admin/LogsAnalyticsTab';

const UserDashboard = () => {
    const {
        user: contextUser, updateProfile,
        adminGetUsers, adminGetLogs, adminGetWatchlists, adminUpdateUserRole,
        adminDeleteUser, adminGetReviews, adminDeleteReview, adminToggleReviewVisibility, adminGetStats
    } = useStore();

    const [user, setUser] = useState(contextUser || { firstName: '', lastName: '', email: '', plan: '', role: 'user' });
    const [activeTab, setActiveTab] = useState(() => {
        const saved = localStorage.getItem('cinaverse_dashboard_tab');
        return saved || (contextUser?.role === 'admin' ? 'overview' : 'profile');
    });

    const [onMount, setOnMount] = useState(false);
    const [lastUserId, setLastUserId] = useState(contextUser?.id);

    useEffect(() => {
        localStorage.setItem('cinaverse_dashboard_tab', activeTab);
    }, [activeTab]);

    // Validation: Reset tab if user role changes or doesn't match current tab
    useEffect(() => {
        if (contextUser) {
            const adminTabs = ['overview', 'users', 'reviews', 'watchlist', 'logs'];
            const isAdminTab = adminTabs.includes(activeTab);

            if (contextUser.role !== 'admin' && isAdminTab) {
                setActiveTab('profile');
            }

            // Full state reset if user actually switched (e.g. logout/login)
            if (contextUser.id !== lastUserId) {
                setLastUserId(contextUser.id);
                setAdminData({
                    users: [], logs: { loginLogs: [], apiLogs: [] }, watchlists: [], reviews: [], stats: {}
                });
                setActiveTab(contextUser.role === 'admin' ? 'overview' : 'profile');
            }
        }
    }, [contextUser, activeTab, lastUserId]);

    const [adminData, setAdminData] = useState({
        users: [], logs: { loginLogs: [], apiLogs: [] }, watchlists: [], reviews: [], stats: {}
    });

    const loadAdminData = React.useCallback(async () => {
        // Fetch stats first as they are light
        Promise.resolve(adminGetStats()).then(stats => setAdminData(prev => ({ ...prev, stats: stats || {} }))).catch(() => { });

        // Fetch everything else independently so one slow call doesn't block others
        Promise.resolve(adminGetUsers()).then(u => setAdminData(prev => ({ ...prev, users: Array.isArray(u) ? u : [] }))).catch(() => { });
        Promise.resolve(adminGetLogs()).then(l => setAdminData(prev => ({ ...prev, logs: (l && typeof l === 'object' && !Array.isArray(l)) ? l : { loginLogs: [], apiLogs: [] } }))).catch(() => { });
        Promise.resolve(adminGetWatchlists()).then(w => setAdminData(prev => ({ ...prev, watchlists: Array.isArray(w) ? w : [] }))).catch(() => { });
        Promise.resolve(adminGetReviews()).then(r => setAdminData(prev => ({ ...prev, reviews: Array.isArray(r) ? r : [] }))).catch(() => { });
    }, [adminGetStats, adminGetUsers, adminGetLogs, adminGetWatchlists, adminGetReviews]);

    useEffect(() => {
        if (contextUser) {
            setUser(contextUser);
            if (contextUser.role === 'admin' && !onMount) {
                // Initial load only
                loadAdminData();
                setOnMount(true);
            }
        }
    }, [contextUser, loadAdminData, onMount]);

    const handleSaveProfile = React.useCallback(async (formData) => {
        const updated = await updateProfile(formData);
        setUser(prev => ({ ...prev, ...updated }));
    }, [updateProfile]);

    const handleUpdateRole = React.useCallback(async (id, role) => {
        // Optimistic update
        setAdminData(prev => ({
            ...prev,
            users: prev.users.map(u => u.id === id ? { ...u, role } : u)
        }));

        try {
            await adminUpdateUserRole(id, role);
            // loadAdminData(); // No need to reload immediately if optimistic update works
        } catch (e) {
            alert(e.message);
            loadAdminData(); // Revert on failure
        }
    }, [adminUpdateUserRole, loadAdminData]);

    const handleDeleteUser = React.useCallback(async (id) => {
        if (!window.confirm('Delete user?')) return;
        try {
            await adminDeleteUser(id);
            loadAdminData();
        } catch (e) { alert(e.message); }
    }, [adminDeleteUser, loadAdminData]);

    const handleDeleteReview = React.useCallback(async (id) => {
        if (!window.confirm('Delete review?')) return;

        // Optimistic update: Remove from UI immediately
        setAdminData(prev => ({
            ...prev,
            reviews: prev.reviews.filter(r => r.id !== id)
        }));

        try {
            await adminDeleteReview(id);
            // UI is already updated optimistically. 
            // We do NOT reload data immediately to avoid race conditions with the cache invalidation.
        } catch (e) {
            alert(e.message);
            loadAdminData(); // Revert on error
        }
    }, [adminDeleteReview, loadAdminData]);

    const handleToggleReviewVisibility = React.useCallback(async (id) => {
        // Optimistic update
        setAdminData(prev => ({
            ...prev,
            reviews: prev.reviews.map(r => r.id === id ? { ...r, isVisible: r.isVisible === false ? true : false } : r)
        }));

        try {
            await adminToggleReviewVisibility(id);
            // loadAdminData(); // Rely on optimistic update to prevent flickering
        } catch (e) {
            alert(e.message);
            loadAdminData(); // Revert
        }
    }, [adminToggleReviewVisibility, loadAdminData]);

    if (user.role === 'parent') return <ParentDashboard />;

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            <main className="flex-grow-1 pb-5 mt-5" style={{ paddingTop: 64 }}>
                <div className="container py-4">
                    <div className="row g-3">
                        <div className="col-lg-3">
                            <UserSidebar user={user} activeTab={activeTab} onTabChange={setActiveTab} />
                        </div>
                        <div className="col-lg-9">
                            <div className="transition-all duration-300">
                                {activeTab === 'profile' && <ProfileTab user={user} onSave={handleSaveProfile} />}
                                {activeTab === 'subscription' && <SubscriptionTab />}
                                {activeTab === 'settings' && <SettingsTab />}
                                {activeTab === 'overview' && <OverviewTab stats={adminData.stats} />}
                                {activeTab === 'users' && <UserManagementTab users={adminData.users} onUpdateRole={handleUpdateRole} onDeleteUser={handleDeleteUser} />}
                                {activeTab === 'reviews' && <ReviewModerationTab reviews={adminData.reviews} onDeleteReview={handleDeleteReview} onToggleVisibility={handleToggleReviewVisibility} />}
                                {activeTab === 'watchlist' && <WatchlistMonitoringTab watchlists={adminData.watchlists} />}
                                {activeTab === 'logs' && <LogsAnalyticsTab logs={adminData.logs} />}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserDashboard;
