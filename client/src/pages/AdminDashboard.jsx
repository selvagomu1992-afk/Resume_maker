import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FileText, CreditCard, LogOut, ShieldCheck, Search } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [stats, setStats] = useState({ totalUsers: 0, totalResumes: 0, paidResumes: 0 })
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const adminToken = localStorage.getItem('adminToken')

    useEffect(() => {
        if (!adminToken) {
            navigate('/admin')
            return
        }
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const headers = { Authorization: adminToken }
            const [usersRes, statsRes] = await Promise.all([
                api.get('/api/admin/users', { headers }),
                api.get('/api/admin/stats', { headers }),
            ])
            setUsers(usersRes.data.users)
            setStats(statsRes.data.stats)
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
                <button
                    onClick={handleLogout}
                    className='flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors'
                >
                    <LogOut className='size-4' /> Logout
                </button>
            </div>

            <div className='max-w-7xl mx-auto px-4 py-8'>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
                    <StatCard
                        icon={<Users className='size-6 text-indigo-600' />}
                        bg='bg-indigo-50'
                        label='Total Users'
                        value={stats.totalUsers}
                    />
                    <StatCard
                        icon={<FileText className='size-6 text-purple-600' />}
                        bg='bg-purple-50'
                        label='Total Resumes'
                        value={stats.totalResumes}
                    />
                    <StatCard
                        icon={<CreditCard className='size-6 text-green-600' />}
                        bg='bg-green-50'
                        label='Paid Resumes'
                        value={stats.paidResumes}
                    />
                </div>

                {/* Users Table */}
                <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100'>
                        <h2 className='text-base font-semibold text-gray-800'>All Users</h2>
                        <div className='flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-full sm:w-64'>
                            <Search className='size-4 text-gray-400 shrink-0' />
                            <input
                                type='text'
                                placeholder='Search by name or email...'
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className='bg-transparent border-none outline-none ring-0 text-sm w-full'
                            />
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
                                        <th className='px-6 py-3 text-center'>Status</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-100'>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className='text-center py-10 text-gray-400'>
                                                No users found
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((user, index) => (
                                            <tr key={user._id} className='hover:bg-gray-50 transition-colors'>
                                                <td className='px-6 py-4 text-gray-400'>{index + 1}</td>
                                                <td className='px-6 py-4 font-medium text-gray-800'>{user.name}</td>
                                                <td className='px-6 py-4 text-gray-500'>{user.email}</td>
                                                <td className='px-6 py-4 text-gray-500'>
                                                    {new Date(user.createdAt).toLocaleDateString('en-IN', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                </td>
                                                <td className='px-6 py-4 text-center'>
                                                    <span className='inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-semibold text-xs'>
                                                        {user.totalResumes}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4 text-center'>
                                                    <span className='inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-700 font-semibold text-xs'>
                                                        {user.paidResumes}
                                                    </span>
                                                </td>
                                                <td className='px-6 py-4 text-center'>
                                                    {user.paidResumes > 0 ? (
                                                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                                                            Paid
                                                        </span>
                                                    ) : (
                                                        <span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500'>
                                                            Free
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
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
