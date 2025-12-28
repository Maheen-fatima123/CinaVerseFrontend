import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    return (
        <div className="min-vh-100" style={{ paddingTop: 64, backgroundColor: 'var(--background-color)' }}>
            <Navbar />
            <div className="container py-5 text-center" style={{ marginTop: 80, color: 'var(--text-color)' }}>
                <div className="mb-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
                </div>
                <h1 className="mb-3 fw-black uppercase tracking-tighter">Payment Successful!</h1>
                <p className="lead opacity-75 mb-5 mx-auto" style={{ maxWidth: '600px' }}>Your subscription is now active. You have full access to all premium CINAVERSE features now.</p>

                <button className="btn custom-red-btn btn-lg px-5 fw-black uppercase tracking-widest" onClick={() => navigate('/dashboard/user')}>
                    Go to Dashboard
                </button>
            </div>
            <Footer />
        </div>
    );
};
export default PaymentSuccess;
