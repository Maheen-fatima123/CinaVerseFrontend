import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
    const { getPlans } = useStore();
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const p = getPlans();
        // 1. Immediate sync update if cached
        if (!(p instanceof Promise)) {
            if (Array.isArray(p)) setPlans(p);
        }
        // 2. Background fresh resolve
        Promise.resolve(p).then(data => {
            if (Array.isArray(data)) setPlans(data);
        }).catch(console.error);
    }, [getPlans]);

    return (
        <div className="min-vh-100" style={{ paddingTop: 64, backgroundColor: 'var(--background-color)' }}>
            <Navbar />
            <div className="container py-5" style={{ marginTop: 40 }}>
                <h1 className="text-white text-center mb-5">Choose Your Plan</h1>
                <div className="row g-4 justify-content-center">
                    {plans.map(plan => (
                        <div key={plan.id} className="col-md-4">
                            <div className="card h-100 border-secondary" style={{ backgroundColor: 'var(--secondary-bg)', color: 'var(--text-color)' }}>
                                <div className="card-body d-flex flex-column text-center p-4">
                                    <h3 className="card-title text-danger mb-4">{plan.name}</h3>
                                    <h2 className="display-4 fw-bold mb-4">${(plan.price / 100).toFixed(2)}<span className="fs-6 text-muted">/mo</span></h2>
                                    <ul className="list-unstyled mb-4 text-start mx-auto" style={{ maxWidth: 200 }}>
                                        <li className="mb-2">✓ {plan.resolution || 'Standard'} Resolution</li>
                                        <li className="mb-2">✓ {plan.maxDevices || 1} Devices</li>
                                        <li className="mb-2">✓ Ad-free streaming</li>
                                        {plan.name === 'Premium' && <li className="mb-2">✓ Offline Downloads</li>}
                                        {plan.name === 'Premium' && <li className="mb-2">✓ HDR Support</li>}
                                    </ul>
                                    <div className="mt-auto">
                                        <button className="btn custom-red-btn w-100 py-2 fs-5" onClick={() => navigate(`/checkout?planId=${plan.id}`)}>
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {plans.length === 0 && <div className="text-white text-center">Loading plans...</div>}
                </div>
            </div>
            <Footer />
        </div>
    );
};
export default Plans;
