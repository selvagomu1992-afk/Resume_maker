import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FileText, CreditCard, LogOut, ShieldCheck, Search, IndianRupee, Download, Edit2, Check, X, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [stats, setStats] = useState({ totalUsers: 0, totalResumes: 0, paidResumes: 0, totalRevenue: 0 })
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [paymentAmount, setPaymentAmount] = useState(49)
    const [editingPrice, setEditingPrice] = useState(false)
    const [newPrice, setNewPrice] = useState('')
    const [expandedUser, setExpandedUser] = useState(null) // userId whose resumes are expanded
    const [editingAmountUserId, setEditingAmountUserId] = useState(null)
    const [newUserAmount, setNewUserAmount] = useState('')

    const adminToken = localStorage.getItem('adminToken')
    const headers = { Authorization: adminToken }

    useEffect(() => {
        if (!adminToken) { navigate('/admin'); return }
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [usersRes, statsRes, priceRes] = await Promise.all([
                api.get('/api/admin/users', { headers }),
                api.get('/api/admin/stats', { headers }),
                api.get('/api/admin/payment-amount', { headers }),
            ])
            setUsers(usersRes.data.users)
            setStats(statsRes.data.stats)
            setPaymentAmount(priceRes.data.amount)
        } catch (error) {
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                localStorage.removeItem('adminToken')
                navigate('/admin')
            }
            toast.error(error?.response?.data?.message || 'Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        navigate('/admin')
    }

    const savePrice = async () => {
        const val = parseFloat(newPrice)
        if (!val || val <= 0) { toast.error('Enter a valid amount'); return }
        try {
            const { data } = await api.put('/api/admin/payment-amount', { amount: val }, { headers })
            setPaymentAmount(data.amount)
            setEditingPrice(false)
            setNewPrice('')
            toast.success(`Payment price updated to ₹${data.amount}`)
            const statsRes = await api.get('/api/admin/stats', { headers })
            setStats(statsRes.data.stats)
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update price')
        }
    }

    const toggleResumePayment = async (userId, resumeId, currentIsPaid) => {
        try {
            await api.put(`/api/admin/user/${userId}/payment`, { isPaid: !currentIsPaid, resumeId }, { headers })
            // Update local state
            setUsers(prev => prev.map(u => {
                if (u._id !== userId) return u
                const updatedResumes = u.resumes.map(r =>
                    r._id === resumeId ? { ...r, isPaid: !currentIsPaid } : r
                )
                const paidCount = updatedResumes.filter(r => r.isPaid).length
                return { ...u, resumes: updatedResumes, paidResumes: paidCount, paidAmount: paidCount * paymentAmount }
            }))
            // Refresh stats
            const statsRes = await api.get('/api/admin/stats', { headers })
            setStats(statsRes.data.stats)
            toast.success(`Resume marked as ${!currentIsPaid ? 'Paid' : 'Unpaid'}`)
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to update')
        }
    }

    const saveUserAmount = async (userId) => {
        const val = parseFloat(newUserAmount)
        if (!val || val <= 0) { toast.error('Enter a valid amount'); return }
        try {
            await api.put(`/api/admin/user/${userId}/amount`, { amount: val }, { headers })
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, customPaymentAmount: val } : u))
            setEditingAmountUserId(null)
            setNewUserAmount('')
            toast.success(`Custom amount ₹${val} set for user`)
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed')
        }
    }

    const resetUserAmount = async (userId) => {
        try {
            await api.put(`/api/admin/user/${userId}/amount`, { amount: null }, { headers })
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, customPaymentAmount: null } : u))
            toast.success('Reset to global amount')
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed')
        }
    }

    const deleteUser = async (userId, userName) => {
        if (!window.confirm(`Delete user "${userName}" and all their resumes? This cannot be undone.`)) return
        try {
            await api.delete(`/api/admin/user/${userId}`, { headers })
            setUsers(prev => prev.filter(u => u._id !== userId))
            const statsRes = await api.get('/api/admin/stats', { headers })
            setStats(statsRes.data.stats)
            toast.success('User deleted')
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to delete user')
        }
    }

    const downloadCSV = () => {
        fetch(`${api.defaults.baseURL || ''}/api/admin/download-payments`, { headers: { Authorization: adminToken } })
            .then(res => res.blob())
            .then(blob => {
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = 'payments.csv'
                link.click()
                URL.revokeObjectURL(link.href)
                toast.success('CSV downloaded')
            })
            .catch(() => toast.error('Download failed'))
    }

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Navbar */}
            <div className='bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <ShieldCheck className='size-6 text-indigo-600' />
                    <span className='text-lg font-semibold text-gray-800'>Admin Dashboard</span>
                </div>
                <button onClick={handleLogout} className='flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors'>
                    <LogOut className='size-4' /> Logout
                </button>
            </div>

            <div className='max-w-7xl mx-auto px-4 py-8'>

                {/* Stats Cards */}
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6'>
                    <StatCard icon={<Users className='size-6 text-indigo-600' />} bg='bg-indigo-50' label='Total Users' value={stats.totalUsers} />
                    <StatCard icon={<FileText className='size-6 text-purple-600' />} bg='bg-purple-50' label='Total Resumes' value={stats.totalResumes} />
                    <StatCard icon={<CreditCard className='size-6 text-green-600' />} bg='bg-green-50' label='Paid Resumes' value={stats.paidResumes} />
                    <StatCard icon={<IndianRupee className='size-6 text-yellow-600' />} bg='bg-yellow-50' label='Total Revenue' value={`₹${stats.totalRevenue}`} />
                </div>

                {/* Payment Price Editor */}
                <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    <div>
                        <p className='text-sm font-semibold text-gray-700'>Download Price (per resume)</p>
                        <p className='text-xs text-gray-400 mt-0.5'>Amount charged to users for downloading their resume</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        {editingPrice ? (
                            <>
                                <div className='flex items-center gap-1 border border-gray-300 rounded-lg overflow-hidden'>
                                    <span className='px-2 text-gray-500 font-medium'>₹</span>
                                    <input type='number' value={newPrice} onChange={e => setNewPrice(e.target.value)}
                                        placeholder={String(paymentAmount)} className='w-24 py-2 pr-2 text-sm border-none outline-none ring-0' autoFocus min={1} />
                                </div>
                                <button onClick={savePrice} className='p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'><Check className='size-4' /></button>
                                <button onClick={() => { setEditingPrice(false); setNewPrice('') }} className='p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors'><X className='size-4' /></button>
                            </>
                        ) : (
                            <>
                                <span className='text-2xl font-bold text-gray-800'>₹{paymentAmount}</span>
                                <button onClick={() => { setEditingPrice(true); setNewPrice(String(paymentAmount)) }}
                                    className='flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors'>
                                    <Edit2 className='size-3.5' /> Edit Price
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Users Table */}
                <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100'>
                        <h2 className='text-base font-semibold text-gray-800'>All Users</h2>
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-56'>
                                <Search className='size-4 text-gray-400 shrink-0' />
                                <input type='text' placeholder='Search...' value={search} onChange={e => setSearch(e.target.value)}
                                    className='bg-transparent border-none outline-none ring-0 text-sm w-full' />
                            </div>
                            <button onClick={downloadCSV}
                                className='flex items-center gap-1.5 px-3 py-2 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors whitespace-nowrap'>
                                <Download className='size-4' /> Download CSV
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className='flex items-center justify-center py-16'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600' />
                        </div>
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                                        <th className='px-6 py-3'>#</th>
                                        <th className='px-6 py-3'>Name</th>
                                        <th className='px-6 py-3'>Email</th>
                                        <th className='px-6 py-3'>Joined</th>
                                        <th className='px-6 py-3 text-center'>Resumes</th>
                                        <th className='px-6 py-3 text-center'>Paid</th>
                                        <th className='px-6 py-3 text-center'>Amount</th>
                                        <th className='px-6 py-3 text-center'>Status</th>
                                        <th className='px-6 py-3 text-center'>Edit</th>
                                        <th className='px-6 py-3 text-center'>Delete</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-100'>
                                    {filtered.length === 0 ? (
                                        <tr><td colSpan={10} className='text-center py-10 text-gray-400'>No users found</td></tr>
                                    ) : (
                                        filtered.map((user, index) => (
                                            <React.Fragment key={user._id}>
                                                <tr className='hover:bg-gray-50 transition-colors'>
                                                    <td className='px-6 py-4 text-gray-400'>{index + 1}</td>
                                                    <td className='px-6 py-4 font-medium text-gray-800'>{user.name}</td>
                                                    <td className='px-6 py-4 text-gray-500'>{user.email}</td>
                                                    <td className='px-6 py-4 text-gray-500'>
                                                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </td>
                                                    <td className='px-6 py-4 text-center'>
                                                        <span className='inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs'>{user.totalResumes}</span>
                                                    </td>
                                                    <td className='px-6 py-4 text-center'>
                                                        <span className='inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-semibold text-xs'>{user.paidResumes}</span>
                                                    </td>
                                                    <td className='px-6 py-4 text-center'>
                                                        {editingAmountUserId === user._id ? (
                                                            <div className='flex items-center justify-center gap-1'>
                                                                <span className='text-xs text-gray-500'>₹</span>
                                                                <input
                                                                    type='number'
                                                                    value={newUserAmount}
                                                                    onChange={e => setNewUserAmount(e.target.value)}
                                                                    className='w-16 text-xs px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-400'
                                                                    autoFocus
                                                                    min={1}
                                                                    onKeyDown={e => { if (e.key === 'Enter') saveUserAmount(user._id); if (e.key === 'Escape') { setEditingAmountUserId(null); setNewUserAmount('') } }}
                                                                />
                                                                <button onClick={() => saveUserAmount(user._id)} className='p-1 bg-green-500 text-white rounded hover:bg-green-600'><Check className='size-3' /></button>
                                                                <button onClick={() => { setEditingAmountUserId(null); setNewUserAmount('') }} className='p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300'><X className='size-3' /></button>
                                                            </div>
                                                        ) : (
                                                            <div className='flex items-center justify-center gap-1.5'>
                                                                <span className={`font-semibold text-sm ${user.customPaymentAmount ? 'text-indigo-600' : 'text-yellow-700'}`}>
                                                                    ₹{user.customPaymentAmount ?? paymentAmount}
                                                                    {user.customPaymentAmount && <span className='text-xs font-normal text-indigo-400 ml-0.5'>(custom)</span>}
                                                                </span>
                                                                <button
                                                                    onClick={() => { setEditingAmountUserId(user._id); setNewUserAmount(String(user.customPaymentAmount ?? paymentAmount)) }}
                                                                    className='p-0.5 text-gray-400 hover:text-indigo-500 transition-colors'
                                                                    title='Edit amount for this user'
                                                                >
                                                                    <Edit2 className='size-3' />
                                                                </button>
                                                                {user.customPaymentAmount && (
                                                                    <button
                                                                        onClick={() => resetUserAmount(user._id)}
                                                                        className='p-0.5 text-gray-400 hover:text-red-500 transition-colors'
                                                                        title='Reset to global amount'
                                                                    >
                                                                        <X className='size-3' />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className='px-6 py-4 text-center'>
                                                        {user.paidResumes > 0
                                                            ? <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>Paid</span>
                                                            : <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500'>Free</span>
                                                        }
                                                    </td>
                                                    <td className='px-6 py-4 text-center'>
                                                        {user.totalResumes > 0 && (
                                                            <button
                                                                onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                                                                className='flex items-center gap-1 mx-auto px-2.5 py-1 text-xs bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors'
                                                            >
                                                                <Edit2 className='size-3' />
                                                                {expandedUser === user._id ? <ChevronUp className='size-3' /> : <ChevronDown className='size-3' />}
                                                            </button>
                                                        )}
                                                    </td>
                                                    <td className='px-6 py-4 text-center'>
                                                        <button
                                                            onClick={() => deleteUser(user._id, user.name)}
                                                            className='flex items-center gap-1 mx-auto px-2.5 py-1 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors'
                                                            title='Delete user and all resumes'
                                                        >
                                                            <Trash2 className='size-3' /> Delete
                                                        </button>
                                                    </td>
                                                </tr>

                                                {/* Expanded resume list for this user */}
                                                {expandedUser === user._id && user.resumes && (
                                                    <tr>
                                                        <td colSpan={10} className='px-6 py-3 bg-indigo-50/50'>
                                                            <p className='text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide'>Resumes — toggle payment status</p>
                                                            <div className='flex flex-wrap gap-2'>
                                                                {user.resumes.map(resume => (
                                                                    <div key={resume._id} className='flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm'>
                                                                        <span className='text-xs text-gray-700 font-medium max-w-[120px] truncate'>{resume.title || 'Untitled'}</span>
                                                                        <button
                                                                            onClick={() => toggleResumePayment(user._id, resume._id, resume.isPaid)}
                                                                            className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${resume.isPaid
                                                                                ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600'
                                                                                : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'
                                                                            }`}
                                                                        >
                                                                            {resume.isPaid ? '✓ Paid' : '✗ Unpaid'}
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const StatCard = ({ icon, bg, label, value }) => (
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4'>
        <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
        <div>
            <p className='text-sm text-gray-500'>{label}</p>
            <p className='text-2xl font-bold text-gray-800'>{value}</p>
        </div>
    </div>
)

export default AdminDashboard
