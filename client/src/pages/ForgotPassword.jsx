import React, { useState } from 'react';
import { Mail, Lock, KeyRound } from 'lucide-react';
import api from '../configs/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post('/api/users/forgot-password', { email });
            toast.success(data.message);
            setStep(2);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }
        
        setIsLoading(true);
        try {
            const { data } = await api.post('/api/users/reset-password', { email, otp, password });
            toast.success(data.message);
            navigate('/');
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <div className="sm:w-[400px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-10 bg-white shadow-sm">
                <h1 className="text-gray-900 text-3xl font-medium">{step === 1 ? 'Forgot Password' : 'Reset Password'}</h1>
                
                {step === 1 ? (
                    <form onSubmit={handleSendOtp}>
                        <p className="text-gray-500 text-sm mt-2 mb-6">Enter your email address to receive a 6-digit OTP.</p>
                        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <Mail size={16} color="#6B7280" />
                            <input 
                                type="email" 
                                placeholder="Email id" 
                                className="border-none outline-none ring-0 w-full text-sm" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isLoading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <p className="text-gray-500 text-sm mt-2 mb-6">Enter the OTP sent to <strong>{email}</strong> and your new password.</p>
                        
                        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <KeyRound size={16} color="#6B7280" />
                            <input 
                                type="text" 
                                placeholder="6-digit OTP" 
                                className="border-none outline-none ring-0 w-full text-sm" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                maxLength={6}
                                required 
                            />
                        </div>

                        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <Lock size={16} color="#6B7280" />
                            <input 
                                type="password" 
                                placeholder="New Password" 
                                className="border-none outline-none ring-0 w-full text-sm" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                minLength={6}
                            />
                        </div>
                        
                        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            <Lock size={16} color="#6B7280" />
                            <input 
                                type="password" 
                                placeholder="Confirm Password" 
                                className="border-none outline-none ring-0 w-full text-sm" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                minLength={6}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isLoading ? "Resetting Password..." : "Reset Password"}
                        </button>

                        <button 
                            type="button" 
                            onClick={() => setStep(1)}
                            className="mt-2 text-sm text-gray-500 hover:text-green-500 hover:underline"
                        >
                            Change Email / Resend OTP
                        </button>
                    </form>
                )}
                
                <p className="text-gray-500 text-sm mt-6">Remember your password? <a href="/" className="text-green-500 hover:underline">Log in</a></p>
            </div>
        </div>
    );
};

export default ForgotPassword;
