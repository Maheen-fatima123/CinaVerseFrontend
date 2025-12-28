import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import { fetchTMDBGenres } from './fetchTMDBGenres';
import BASE_URL, { endpoints } from '../routes/api';

const StoreContext = createContext(null);

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch { }
    }, [key, storedValue]);
    return [storedValue, setStoredValue];
}

const StoreProvider = ({ children }) => {
    const [token, setToken] = useLocalStorage('cinaverse_token', null);
    const [user, setUser] = useLocalStorage('cinaverse_user', null);
    const [activeChildId, setActiveChildId] = useLocalStorage('cinaverse_child_id', null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [genres, setGenres] = useState([]);
    const [childProfiles, setChildProfiles] = useState([]);
    const [theme, setTheme] = useLocalStorage('cinaverse_theme', 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = React.useCallback(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }, [setTheme]);
    // --- Advanced Cache System (Persisted & Fast) ---
    const [dataCache, setDataCache] = useState(() => {
        try {
            const saved = localStorage.getItem('cinaverse_movie_cache');
            return saved ? JSON.parse(saved) : {};
        } catch { return {}; }
    });

    useEffect(() => {
        try { localStorage.setItem('cinaverse_movie_cache', JSON.stringify(dataCache)); } catch { }
    }, [dataCache]);

    const pendingRequests = React.useRef(new Map());

    const tokenRef = React.useRef(token);
    useEffect(() => { tokenRef.current = token; }, [token]);

    const authHeader = React.useCallback(() => {
        return tokenRef.current ? { Authorization: `Bearer ${tokenRef.current}` } : {};
    }, []);

    const request = React.useCallback(async (url, options = {}, expectJson = true) => {
        setError(null);
        const headers = {
            'Content-Type': 'application/json',
            ...authHeader(),
            ...(activeChildId ? { 'x-child-id': activeChildId } : {}),
            ...(options.headers || {}),
        };

        const res = await fetch(url, { ...options, headers });

        if (!res.ok) {
            let errMsg = `HTTP ${res.status}`;
            const contentType = res.headers.get('content-type');
            try {
                if (contentType && contentType.includes('application/json')) {
                    const data = await res.json();
                    errMsg = data?.message || errMsg;
                } else {
                    const text = await res.text();
                    errMsg = text || errMsg;
                }
            } catch (e) {
                console.error('Error parsing error response:', e);
            }
            throw new Error(errMsg);
        }

        if (!expectJson) return res;
        return res.json();
    }, [authHeader, activeChildId]);

    // Derive authentication state
    const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);



    const cacheRef = React.useRef(dataCache);

    // Sync cacheRef with dataCache state
    useEffect(() => {
        cacheRef.current = dataCache;
    }, [dataCache]);

    const updateCache = React.useCallback((key, data) => {
        // Synchronously update the ref so the next getFastData call sees it immediately
        cacheRef.current[key] = data;
        setDataCache(prev => {
            if (data === undefined) {
                const next = { ...prev };
                delete next[key];
                return next;
            }
            return { ...prev, [key]: data };
        });
    }, [setDataCache]);

    /**
     * getFastData: SWR Strategy
     * Decoupled from state dependency to prevent infinite loops.
     */
    const getFastData = React.useCallback((key, fetcher) => {
        const cached = cacheRef.current[key];

        if (pendingRequests.current.has(key)) {
            const p = pendingRequests.current.get(key);
            return cached ? cached : p;
        }

        const fetchPromise = (async () => {
            try {
                const freshData = await fetcher();
                // Update state ONLY if data changed (triggers re-render)
                setDataCache(prev => {
                    if (JSON.stringify(prev[key]) === JSON.stringify(freshData)) return prev;
                    return { ...prev, [key]: freshData };
                });
                return freshData;
            } finally {
                pendingRequests.current.delete(key);
            }
        })();

        pendingRequests.current.set(key, fetchPromise);
        return cached ? cached : fetchPromise;
    }, [request]); // Stable between renders

    // Auth Actions
    const login = React.useCallback(async ({ email, password, remember = true }) => {
        setLoading(true);
        try {
            const data = await request(endpoints.auth.login, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            const accessToken = data?.access_token;
            const profile = data?.user;
            if (!accessToken) throw new Error('No access token received');

            setToken(accessToken);
            tokenRef.current = accessToken; // Force immediate update for background calls
            if (!remember) sessionStorage.setItem('cinaverse_token', accessToken);
            if (profile) setUser(profile);

            // Defer pre-fetching to next tick to allow navigation to happen first
            setTimeout(() => {
                getTrendingMovies();
                getLatestMovies();
                getPlans();
                getSubscription();
                getWatchlist();
                request(endpoints.movies.genres).then(g => setGenres(g.genres || [])).catch(() => { });
                if (profile?.role === 'parent') {
                    listChildProfiles().catch(() => { });
                }
            }, 0);

            return { token: accessToken, user: profile };
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [request, setToken, setUser]);

    const register = React.useCallback(async ({ email, password, firstName, lastName }) => {
        setLoading(true);
        try {
            await request(endpoints.auth.register, {
                method: 'POST',
                body: JSON.stringify({ email, password, firstName, lastName }),
            });
            return await login({ email, password });
        } catch (e) {
            setError(e.message);
            throw e;
        } finally {
            setLoading(false);
        }
    }, [request, login]);

    const logout = React.useCallback(async () => {
        setToken(null);
        setUser(null);
        setActiveChildId(null);
        setChildProfiles([]);
        setDataCache({}); // Clear in-memory cache
        localStorage.removeItem('cinaverse_dashboard_tab'); // Reset dashboard tab
        try { sessionStorage.removeItem('cinaverse_token'); } catch { }
        request(endpoints.auth.logout, { method: 'POST' }).catch(() => { });
    }, [request, setActiveChildId, setToken, setUser, setDataCache]);

    const updateProfile = React.useCallback(async (updates) => {
        const profile = await request(endpoints.users.profile, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
        setUser(profile);
        return profile;
    }, [request, setUser]);

    // Movie Actions (Instant Load)
    const searchMovies = React.useCallback(async (q) => {
        if (!q) return { results: [] };
        return getFastData(`search_${q.toLowerCase()}`, () => request(endpoints.movies.search(q)));
    }, [getFastData, request]);

    const getTrendingMovies = React.useCallback(() => getFastData('trending', () => request(endpoints.movies.trending)), [getFastData, request]);
    const getPopularMovies = React.useCallback(() => getFastData('popular', () => request(endpoints.movies.popular)), [getFastData, request]);
    const getLatestMovies = React.useCallback(() => getFastData('latest', () => request(endpoints.movies.latest)), [getFastData, request]);
    const getMovieDetails = React.useCallback((id) => getFastData(`movie_${id}`, () => request(endpoints.movies.details(id))), [getFastData, request]);
    const getMovieTrailer = React.useCallback((id) => getFastData(`trailer_${id}`, () => request(endpoints.movies.trailer(id))), [getFastData, request]);
    const getSimilarMovies = React.useCallback((id) => getFastData(`similar_${id}`, () => request(endpoints.movies.similar(id))), [getFastData, request]);

    // Fetch essential data on mount (Placed after fetcher definitions to avoid ReferenceError)
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                // Background pre-fetch (Safe after definitions)
                getTrendingMovies();
                getLatestMovies();

                const res = await fetch(endpoints.movies.genres);
                if (!res.ok) throw new Error();
                const data = await res.json();
                if (mounted) setGenres(data.genres || []);
            } catch {
                if (mounted) setGenres([]);
            }
        })();
        return () => { mounted = false; };
    }, [getTrendingMovies, getLatestMovies]);

    // Watchlist
    const [watchlistCache, setWatchlistCache] = useState({ data: null, timestamp: 0 });
    const WATCHLIST_TTL = 60000;

    const getWatchlist = React.useCallback(async (force = false) => {
        if (!force && watchlistCache.data && (Date.now() - watchlistCache.timestamp < WATCHLIST_TTL)) return watchlistCache.data;
        const data = await request(endpoints.watchlist.list);
        setWatchlistCache({ data, timestamp: Date.now() });
        return data;
    }, [request, watchlistCache]);

    const addToWatchlist = React.useCallback(async (movieId, status = 'pending', category = '') => {
        const res = await request(endpoints.watchlist.add, {
            method: 'POST',
            body: JSON.stringify({ movieId: String(movieId), status, category }),
        });
        setWatchlistCache({ data: null, timestamp: 0 });
        return res;
    }, [request]);

    const removeFromWatchlist = React.useCallback(async (id) => {
        const res = await request(endpoints.watchlist.remove(id), { method: 'DELETE' }, false);
        setWatchlistCache({ data: null, timestamp: 0 });
        return res;
    }, [request]);

    const updateWatchlist = React.useCallback(async (id, update) => {
        const res = await request(endpoints.watchlist.update(id), {
            method: 'PATCH',
            body: JSON.stringify(update),
        });
        setWatchlistCache({ data: null, timestamp: 0 });
        return res;
    }, [request]);

    // Optimized Reviews (SWR + Instant Update)
    const getReviewsByMovie = React.useCallback((id) => getFastData(`reviews_${id}`, () => request(endpoints.reviews.byMovie(String(id)))), [getFastData, request]);

    const createReview = React.useCallback(async (payload) => {
        const res = await request(endpoints.reviews.create, { method: 'POST', body: JSON.stringify({ ...payload, movieId: String(payload.movieId) }) });
        // Clear specific movie reviews cache synchronously
        updateCache(`reviews_${payload.movieId}`, undefined);
        return res;
    }, [request, updateCache]);

    const updateReview = React.useCallback(async (id, payload) => {
        const res = await request(endpoints.reviews.update(id), { method: 'PUT', body: JSON.stringify(payload) });
        if (payload.movieId) updateCache(`reviews_${payload.movieId}`, undefined);
        return res;
    }, [request, updateCache]);

    const deleteReview = React.useCallback(async (id) => {
        const res = await request(endpoints.reviews.delete(id), { method: 'DELETE' }, false);
        // Clear admin cache synchronously too as reviews changed
        updateCache('admin_reviews', undefined);
        return res;
    }, [request, updateCache]);

    // Child Profiles
    const listChildProfiles = React.useCallback(async () => {
        const p = await request(endpoints.childProfiles.list);
        setChildProfiles(p || []);
        return p;
    }, [request]);

    const createChildProfile = React.useCallback(async (p) => {
        const res = await request(endpoints.childProfiles.create, { method: 'POST', body: JSON.stringify(p) });
        await listChildProfiles();
        return res;
    }, [request, listChildProfiles]);

    const updateChildProfile = React.useCallback(async (id, p) => {
        const res = await request(endpoints.childProfiles.update(id), { method: 'PUT', body: JSON.stringify(p) });
        await listChildProfiles();
        return res;
    }, [request, listChildProfiles]);

    const deleteChildProfile = React.useCallback(async (id) => {
        const res = await request(endpoints.childProfiles.remove(id), { method: 'DELETE' }, false);
        await listChildProfiles();
        return res;
    }, [request, listChildProfiles]);

    // Admin Actions (Instant Dashboard Load)
    const adminGetStats = React.useCallback(() => getFastData('admin_stats', () => request(endpoints.admin.stats)), [getFastData, request]);
    const adminGetUsers = React.useCallback(() => getFastData('admin_users', () => request(endpoints.admin.users)), [getFastData, request]);
    const adminUpdateUserRole = React.useCallback((id, role) => request(endpoints.admin.updateUserRole(id), { method: 'PATCH', body: JSON.stringify({ role }) }), [request]);
    const adminDeleteUser = React.useCallback((id) => request(endpoints.admin.deleteUser(id), { method: 'DELETE' }, false), [request]);
    const adminGetReviews = React.useCallback(() => getFastData('admin_reviews', () => request(endpoints.admin.reviews)), [getFastData, request]);
    const adminDeleteReview = React.useCallback(async (id) => {
        const res = await request(endpoints.admin.deleteReview(id), { method: 'DELETE' }, false);
        setDataCache(prev => {
            const next = { ...prev };
            // Clear admin reviews list cache
            delete next['admin_reviews'];
            return next;
        });
        return res;
    }, [request, setDataCache]);

    const adminToggleReviewVisibility = React.useCallback(async (id) => {
        const res = await request(endpoints.admin.toggleReviewVisibility(id), { method: 'PATCH' });
        updateCache('admin_reviews', undefined);
        return res;
    }, [request, updateCache]);
    const adminGetLogs = React.useCallback(() => request(endpoints.admin.logs), [request]);
    const adminGetWatchlists = React.useCallback(() => getFastData('admin_watchlists', () => request(endpoints.admin.watchlists)), [getFastData, request]);

    const selectChildProfile = React.useCallback((id) => setActiveChildId(id), [setActiveChildId]);
    const clearChildProfile = React.useCallback(() => setActiveChildId(null), [setActiveChildId]);

    const createPaymentIntent = React.useCallback((planId) => request(endpoints.plans.createIntent, { method: 'POST', body: JSON.stringify({ planId }) }), [request]);
    const verifyPayment = React.useCallback(async (payload) => {
        const res = await request(endpoints.plans.verifyPayment, { method: 'POST', body: JSON.stringify(payload) });
        // Clear sub cache synchronously
        updateCache('subscription', undefined);
        return res;
    }, [request, updateCache]);

    // Context Value Memoization
    const value = useMemo(() => ({
        token, user, activeChildId, loading, error, isAuthenticated, genres, childProfiles,
        register, login, logout, updateProfile,
        searchMovies, getTrendingMovies, getPopularMovies, getLatestMovies, getMovieDetails, getMovieTrailer, getSimilarMovies,
        getWatchlist, addToWatchlist, removeFromWatchlist, updateWatchlist,
        createReview, getReviewsByMovie, updateReview, deleteReview,
        listChildProfiles, createChildProfile, updateChildProfile, deleteChildProfile,
        selectChildProfile, clearChildProfile,
        setActiveChildId, adminGetStats, adminGetUsers, adminUpdateUserRole, adminDeleteUser,
        adminGetReviews, adminDeleteReview, adminToggleReviewVisibility, adminGetLogs, adminGetWatchlists,
        createPaymentIntent, verifyPayment, theme, toggleTheme,
        getSubscription: () => getFastData('subscription', () => request(endpoints.subscription.get)),
        unsubscribe: async () => {
            await request(endpoints.plans.unsubscribe, { method: 'POST' });
            updateCache('subscription', undefined);
        },
        getPlans: () => getFastData('plans', () => request(endpoints.plans.list)),
    }), [
        token, user, activeChildId, loading, error, isAuthenticated, genres, childProfiles,
        register, login, logout, updateProfile, searchMovies, getTrendingMovies, getPopularMovies,
        getLatestMovies, getMovieDetails, getMovieTrailer, getSimilarMovies, getWatchlist,
        addToWatchlist, removeFromWatchlist, updateWatchlist, createReview, getReviewsByMovie,
        updateReview, deleteReview, listChildProfiles, createChildProfile, updateChildProfile,
        deleteChildProfile, selectChildProfile, clearChildProfile, setActiveChildId, adminGetStats, adminGetUsers, adminUpdateUserRole,
        adminDeleteUser, adminGetReviews, adminDeleteReview, adminToggleReviewVisibility, adminGetLogs, adminGetWatchlists,
        createPaymentIntent, verifyPayment, request, theme, toggleTheme
    ]);

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};


export const useStore = () => useContext(StoreContext);

export function getDashboardPath(user) {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/user';
    if (user.role === 'parent') return '/parent-dashboard';
    return '/dashboard/user';
}

export default StoreProvider;

