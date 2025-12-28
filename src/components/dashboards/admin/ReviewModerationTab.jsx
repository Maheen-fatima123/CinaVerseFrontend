import React from 'react';
import { Star, Trash2 } from 'lucide-react';

const ReviewModerationTab = ({ reviews = [], onDeleteReview }) => {
    return (
        <div className="premium-card animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-4 fw-bold fs-4" style={{ color: 'var(--text-color)' }}>My Dashboard</h2>
            <h3 className="text-danger mb-4 border-bottom border-secondary pb-3 fs-6 fw-bold uppercase tracking-widest">Review Moderation</h3>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="text-secondary text-[10px] font-black uppercase tracking-widest">
                    Community Reviews Monitoring ({reviews.length})
                </div>
            </div>

            <div className="row g-4">
                {reviews.map((review) => (
                    <div key={review.id} className="col-12">
                        <div className="border rounded-4 p-4 hover:border-danger/30 transition-all duration-300 shadow-lg" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
                            <div className="row align-items-center g-4">
                                <div className="col-lg-10">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div className="d-flex text-warning">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                        <span className="text-secondary font-black text-[10px] uppercase ms-2">SCORE: {review.rating}.0</span>
                                    </div>
                                    <h4 className="font-black text-lg mb-2" style={{ color: 'var(--text-color)' }}>"{review.comment}"</h4>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="avatar custom-red rounded-circle d-flex justify-content-center align-items-center text-white" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                                            <i className="bi bi-person-fill"></i>
                                        </div>
                                        <span className="text-secondary text-xs font-bold uppercase tracking-wide">
                                            {review.user?.firstName} {review.user?.lastName}
                                            <span className="mx-2 opacity-30">|</span>
                                            <span style={{ color: 'var(--text-color)' }}>MOVIE ID: {review.movieId}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="col-lg-2 d-flex flex-lg-column gap-2 justify-content-end">
                                    <button
                                        className="btn btn-outline-danger btn-sm rounded-pill px-3 text-[10px] font-black tracking-widest"
                                        onClick={() => onDeleteReview(review.id)}
                                    >
                                        <Trash2 size={12} className="me-1" /> DELETE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!reviews.length && (
                <div className="rounded-4 border border-dashed p-5 text-center my-4" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
                    <p className="font-semibold italic mb-0 uppercase tracking-widest text-[11px]" style={{ color: 'var(--muted-text)' }}>No community reviews reported for moderation.</p>
                </div>
            )}
        </div>
    );
};

export default ReviewModerationTab;
