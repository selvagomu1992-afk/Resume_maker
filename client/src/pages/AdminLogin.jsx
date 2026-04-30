import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, ShieldCheck } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const AdminLogin = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await api.post('/api/admin/login', formData)
            if (data.success) {
                localStorage.setItem('adminToken', data.token)
                toast.success('Welcome, Admin!')
                navigate('/admin/dashboard')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50'>
            <form onSubmit={handleSubmit} className='sm:w-[380px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-10 bg-white shadow-sm'>
                <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-indigo-100 rounded-full'>
                        <ShieldCheck className='size-8 text-indigo-600' />
                    </div>
                </div>
                <h1 className='text-gray-900 text-2xl font-semibold'>Admin Login</h1>
                <p className='text-gray-500 text-sm mt-1 mb-6'>Sign in to access the admin dashboard</p>

                <div className='flex items-center w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2'>
                    <Mail size={14} color='#6B7280' />
                    <input
                        type='email'
                        placeholder='Admin email'
                        className='border-none outline-none ring-0 text-sm w-full'
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        required
                    />
                </div>

                <div className='flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2'>
                    <Lock size={14} color='#6B7280' />
                    <input
                        type='password'
                        placeholder='Password'
                        className='border-none outline-none ring-0 text-sm w-full'
                        value={formData.password}
                        onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                        required
                    />
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-60 font-medium'
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    )
}

export default AdminLogin
