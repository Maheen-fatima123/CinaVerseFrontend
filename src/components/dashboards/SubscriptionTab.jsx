import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const SubscriptionTab = () => {
    const { getPlans, getSubscription, unsubscribe } = useStore();
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [isUnsubscribing, setIsUnsubscribing] = useState(false);
    const [loading, setLoading] = useState(false); // Start as false to show UI immediately

    const loadData = React.useCallback(async () => {
        // 1. Fetch Plans
        const p = getPlans();
        if (!(p instanceof Promise)) {
            if (Array.isArray(p)) setPlans(p);
        }
        Promise.resolve(p).then(data => {
            if (Array.isArray(data)) setPlans(data);
        }).catch(console.error);

        // 2. Fetch Subscription
        const s = getSubscription();
        if (!(s instanceof Promise)) {
            setSubscription(s);
        }
        Promise.resolve(s).then(data => {
            setSubscription(data);
        }).catch(console.error);
    }, [getPlans, getSubscription]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleUnsubscribe = async () => {
        if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
        setIsUnsubscribing(true);
        try {
            await unsubscribe();
            alert('Subscription cancelled successfully.');
            setSubscription({ plan: 'None' }); // Immediate local state update
            loadData(); // Double check with fresh fetch
        } catch (error) {
            console.error(error);
            alert('Failed to cancel subscription.');
        } finally {
            setIsUnsubscribing(false);
        }
    };

    const hasActivePlan = subscription && subscription.plan !== 'None';

    if (loading) return <div className="text-danger">Loading your plans...</div>;

    return (
        <div className="premium-card">
            <h2 className="mb-4 fw-bold fs-4" style={{ color: 'var(--text-color)' }}>Subscription Management</h2>

            {/* Current Subscription Status */}
            <div className="mb-4">
                <h3 className="text-danger mb-3 border-bottom border-secondary pb-2 fs-6 fw-bold uppercase tracking-widest">Active Membership</h3>
                {hasActivePlan ? (
                    <div className="p-4 rounded-card border text-white shadow-lg mb-4" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <div className="custom-red p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                    <i className="bi bi-star-fill text-white fs-5"></i>
                                </div>
                            </div>
                            <div className="col">
                                <h5 className="mb-0 fw-black fs-6 tracking-wide" style={{ color: 'var(--text-color)' }}>{subscription.plan.toUpperCase()} PLAN</h5>
                                <p className="mb-0 text-[10px] uppercase tracking-[0.1em] font-bold" style={{ color: 'var(--muted-text)' }}>
                                    RENEWS ON: {subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div className="col-auto d-flex align-items-center gap-3">
                                <span className="badge bg-success px-3 py-1 text-[9px] rounded-pill font-black tracking-wider">ACTIVE</span>
                                <button
                                    className="btn btn-sm border transition-all fw-bold text-[10px] px-3 py-1 rounded-pill hover-red"
                                    style={{ color: 'var(--text-color)', borderColor: 'var(--border-color)' }}
                                    onClick={handleUnsubscribe}
                                    disabled={isUnsubscribing}
                                >
                                    {isUnsubscribing ? '...' : 'Cancel Membership'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 rounded-card border border-dashed text-center mb-4" style={{ backgroundColor: 'var(--secondary-bg)', borderColor: 'var(--border-color) !important' }}>
                        <p className="mb-0 text-[11px] font-bold tracking-widest uppercase italic" style={{ color: 'var(--muted-text)' }}>Subscription Inactive</p>
                    </div>
                )}
            </div>

            {/* Available Plans Selection */}
            <div>
                <h3 className="text-danger mb-3 border-bottom border-secondary pb-2 fs-6 fw-bold uppercase tracking-widest">Change Experience</h3>
                <div className="row g-3">
                    {plans.map(plan => {
                        const isCurrent = subscription?.plan === plan.name;
                        return (
                            <div key={plan.id} className="col-lg-4">
                                <div className={`card h-100 transition-all shadow-sm rounded-card ${isCurrent ? 'border-danger' : ''}`}
                                    style={{ opacity: (!isCurrent && hasActivePlan) ? 0.6 : 1, backgroundColor: 'var(--secondary-bg)', border: '1px solid var(--border-color)' }}>
                                    <div className="card-body d-flex flex-column p-4 text-center">
                                        <div className="mb-3">
                                            <h5 className="fw-black mb-1 fs-5 tracking-tighter" style={{ color: 'var(--text-color)' }}>{plan.name.toUpperCase()}</h5>
                                            {isCurrent && <div className="badge bg-danger rounded-pill px-2 py-0.5 text-[8px] uppercase font-black tracking-widest">CURRENT</div>}
                                        </div>

                                        <div className="mb-4">
                                            <div className="d-flex align-items-baseline justify-content-center gap-1">
                                                <span className="fw-black fs-2" style={{ color: 'var(--text-color)' }}>${(plan.price / 100).toFixed(2)}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--muted-text)' }}>/mo</span>
                                            </div>
                                        </div>

                                        <div className="flex-grow-1 border-top pt-3 mb-4 text-center" style={{ borderColor: 'var(--border-color) !important' }}>
                                            <p className="mb-3 text-[11px] fw-medium leading-relaxed italic" style={{ color: 'var(--muted-text)' }}>
                                                {plan.description || "Stream premium content on multiple screens in high resolution."}
                                            </p>
                                            <div className="d-flex flex-column gap-1">
                                                <div className="text-[10px] fw-bold uppercase tracking-wider" style={{ color: 'var(--text-color)' }}>{plan.resolution} QUALITY</div>
                                                <div className="text-[10px] fw-bold uppercase tracking-wider" style={{ color: 'var(--text-color)' }}>{plan.maxDevices} SCREEN{plan.maxDevices > 1 ? 'S' : ''}</div>
                                            </div>
                                        </div>

                                        <button
                                            className={`btn ${isCurrent ? 'btn-success disabled' : 'custom-red-btn'} w-100 py-2 rounded-pill fw-black tracking-widest`}
                                            style={{ fontSize: '10px' }}
                                            onClick={() => !isCurrent && navigate(`/checkout?planId=${plan.id}`)}
                                            disabled={hasActivePlan && !isCurrent}
                                        >
                                            {isCurrent ? 'SELECTED' : 'UPGRADE'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionTab;
