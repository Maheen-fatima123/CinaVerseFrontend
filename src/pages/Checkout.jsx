import React, { useState, useEffect, useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Use environment variable or fallback to a test key
// Initialized dynamically in Checkout component

const CheckoutForm = ({ planId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { verifyPayment } = useStore();
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setIsProcessing(true);
        setMessage(null);

        console.log('Starting confirmation...');

        // Confirm payment with Stripe
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.origin + '/payment-success',
                },
                redirect: 'if_required',
            });

            console.log('Stripe confirmation result:', { error, paymentIntent });

            if (error) {
                setMessage(error.message);
                setIsProcessing(false);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Ensure backend knows about this payment before moving forward
                // This clears the cache inside StoreContext
                try {
                    await verifyPayment({
                        paymentIntentId: paymentIntent.id,
                        planId: Number(planId)
                    });

                    console.log('Payment verified, navigating...');
                    navigate('/payment-success');
                } catch (verifyError) {
                    console.error('Verification Error:', verifyError);
                    // Even if verification call fails, Stripe succeeded, 
                    // so we still go to success page but maybe show a message
                    navigate('/payment-success');
                }
                setIsProcessing(false);
            } else {
                console.log('Unexpected status:', paymentIntent?.status);
                setMessage('Payment status: ' + (paymentIntent?.status || 'Unknown'));
                setIsProcessing(false);
            }
        } catch (e) {
            console.error('Confirm Error:', e);
            setMessage('An unexpected error occurred: ' + e.message);
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 rounded border-secondary" style={{ maxWidth: 500, margin: '0 auto', backgroundColor: 'var(--secondary-bg)', color: 'var(--text-color)', border: '1px solid var(--border-color)' }}>
            <h4 className="mb-4">Card Details</h4>
            <PaymentElement />
            <div className="mt-4">
                <button disabled={isProcessing || !stripe || !elements} className="btn custom-red-btn w-100 py-2 fs-5">
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
            {message && <div className="alert alert-danger mt-3">{message}</div>}
            <div className="mt-3 text-white-50 small text-center">
                Test Card: 4242 4242 4242 4242
            </div>
        </form>
    );
};

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const planId = searchParams.get('planId');
    const { createPaymentIntent } = useStore();
    const [clientSecret, setClientSecret] = useState('');
    const [stripePromise, setStripePromise] = useState(null);
    const [error, setError] = useState('');

    const fetchingRef = React.useRef(null);

    useEffect(() => {
        if (planId && fetchingRef.current !== planId) {
            fetchingRef.current = planId;
            createPaymentIntent(planId)
                .then(data => {
                    console.log('Payment Intent Data:', data); // Debug log
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret);

                        // Use backend provided key or fallback
                        const key = data.publicKey || import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx';

                        if (!data.publicKey && !import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
                            console.warn('Warning: No Stripe Public Key received. Fallback used.');
                        }

                        setStripePromise(loadStripe(key));
                    } else {
                        setError('Failed to initialize payment: No client secret returned.');
                        fetchingRef.current = null;
                    }
                })
                .catch(err => {
                    setError(err.message || 'Error initiating payment');
                    fetchingRef.current = null;
                });
        }
    }, [planId, createPaymentIntent]);

    const options = useMemo(() => ({
        clientSecret,
        appearance: {
            theme: document.documentElement.getAttribute('data-theme') === 'light' ? 'flat' : 'night',
            variables: { colorPrimary: '#E50914' }
        }
    }), [clientSecret]);

    if (!planId) return <div className="pt-5 text-center" style={{ color: 'var(--text-color)' }}>Invalid Plan ID</div>;

    return (
        <div className="min-vh-100" style={{ paddingTop: 64, backgroundColor: 'var(--background-color)' }}>
            <Navbar />
            <div className="container py-5" style={{ marginTop: 40 }}>
                <h2 className="text-center mb-5" style={{ color: 'var(--text-color)' }}>Complete Your Purchase</h2>
                {error && <div className="alert alert-danger text-center mx-auto" style={{ maxWidth: 500 }}>{error}</div>}

                {clientSecret && stripePromise ? (
                    <Elements key={clientSecret} stripe={stripePromise} options={options}>
                        <CheckoutForm planId={planId} />
                    </Elements>
                ) : (
                    !error && <div className="text-center" style={{ color: 'var(--text-color)' }}>Loading payment methods...</div>
                )}
            </div>
            <Footer />
        </div>
    );
};
export default Checkout;
