import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { load } from '@cashfreepayments/cashfree-js';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const Payment = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const { token } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(true);
    const hasInitialized = useRef(false);

    useEffect(() => {
        const initializePayment = async () => {
            if (hasInitialized.current) return;
            hasInitialized.current = true;
            
            try {
                // Fetch payment session ID from backend
                const { data } = await api.post('/api/payment/create-order', { resumeId }, {
                    headers: { Authorization: token }
                });

                if (data.success && data.payment_session_id) {
                    const cashfree = await load({
                        mode: "production" // or sandbox based on your environment
                    });

                    let checkoutOptions = {
                        paymentSessionId: data.payment_session_id,
                        redirectTarget: "_self", // Redirects in the same window
                    };

                    cashfree.checkout(checkoutOptions);
                } else {
                    toast.error(data.message || 'Failed to initialize payment');
                    navigate(`/app/builder/${resumeId}`);
                }
            } catch (error) {
                console.error(error);
                toast.error('Payment initialization error');
                navigate(`/app/builder/${resumeId}`);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            initializePayment();
        } else {
            navigate('/login');
        }
    }, [resumeId, token, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {loading ? (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Initializing secure payment gateway...</p>
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600">Redirecting to Cashfree checkout...</p>
                </div>
            )}
        </div>
    );
};

export default Payment;
