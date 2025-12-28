import React from 'react';
import { TrendingUp, Clock, AlertCircle, Film } from 'lucide-react';

const WatchlistMonitoringTab = ({ watchlists = [] }) => {
    // Process watchlists to find trending movies
    const movieCounts = watchlists.reduce((acc, wl) => {
        const id = wl.movieId || wl.tmdbId || 'Unknown';
        acc[id] = (acc[id] || 0) + 1;
        return acc;
    }, {});

    const sortedMovies = Object.entries(movieCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="premium-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4 fw-bold fs-4" style={{ color: 'var(--text-color)' }}>My Dashboard</h2>
            <h3 className="text-danger mb-4 border-bottom border-secondary pb-3 fs-6 fw-bold uppercase tracking-widest">Watchlist Monitoring</h3>

            <div className="row g-4 mb-4">
                {/* Most Added Movies */}
                <div className="col-lg-6">
                    <div className="rounded-4 border p-4 shadow-2xl h-100" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
                        <h3 className="text-lg font-black mb-4 d-flex align-items-center gap-3 tracking-tighter" style={{ color: 'var(--text-color)' }}>
                            <TrendingUp size={24} className="text-danger" />
                            Most Added Content
                        </h3>
                        <div className="d-flex flex-column gap-4">
                            {sortedMovies.map(([movieId, count], index) => (
                                <div key={movieId} className="d-flex align-items-center justify-content-between group border-bottom border-gray-900 pb-2">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="text-xl font-black text-gray-800 group-hover:text-danger transition-colors w-8">
                                            0{index + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold leading-none mb-1" style={{ color: 'var(--text-color)' }}>MOVIE ID: {movieId}</p>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <p className="font-black mb-0" style={{ color: 'var(--text-color)' }}>{count}</p>
                                        <p className="text-[10px] uppercase font-bold tracking-widest mb-0" style={{ color: 'var(--muted-text)' }}>ADDS</p>
                                    </div>
                                </div>
                            ))}
                            {!sortedMovies.length && <p className="text-secondary italic text-center py-5 uppercase tracking-widest text-[11px]">No watchlist data found.</p>}
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="col-lg-6">
                    <div className="rounded-4 border p-4 shadow-2xl h-100" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
                        <h3 className="text-lg font-black mb-4 d-flex align-items-center gap-3 tracking-tighter" style={{ color: 'var(--text-color)' }}>
                            <Clock size={24} className="text-primary" />
                            Global Activity Feed
                        </h3>
                        <div className="d-flex flex-column gap-4">
                            {watchlists.slice(0, 5).map((wl, i) => (
                                <div key={wl.id} className="d-flex gap-3 align-items-start pb-3 border-bottom border-gray-900 last:border-0 last:pb-0">
                                    <div className="p-2 bg-primary/10 rounded-3 text-primary shadow-lg shadow-primary/10">
                                        <Film size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-color)' }}>
                                            {wl.user?.firstName || 'System'} added content to list
                                        </p>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="text-[10px] bg-gray-900 text-secondary px-2 py-0.5 rounded  font-black border border-dark">
                                                {wl.category || 'GENERAL'}
                                            </span>
                                            <span className="text-secondary text-[10px] font-black uppercase tracking-widest">Recently</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!watchlists.length && <p className="text-secondary italic text-center py-5 uppercase tracking-widest text-[11px]">No active watchlists tracked.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchlistMonitoringTab;
