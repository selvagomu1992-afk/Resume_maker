import React, { useEffect, lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import { useDispatch } from 'react-redux'
import api from './configs/api'
import { login, setLoading } from './app/features/authSlice'
import { Toaster } from 'react-hot-toast'

// Lazy load heavy pages to avoid circular dependency issues
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'))
const Preview = lazy(() => import('./pages/Preview'))
const Payment = lazy(() => import('./pages/Payment'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const PrintResume = lazy(() => import('./pages/PrintResume'))

const App = () => {

  const dispatch = useDispatch()

  const getUserData = async () => {
    const token = localStorage.getItem('token')
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', { headers: { Authorization: token } })
        if (data.user) {
          dispatch(login({ token, user: data.user }))
        }
        dispatch(setLoading(false))
      } else {
        dispatch(setLoading(false))
      }
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.message)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <>
      <Toaster />
      <Suspense fallback={<div className='flex items-center justify-center min-h-screen'><div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600' /></div>}>
        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='app' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='builder/:resumeId' element={<ResumeBuilder />} />
          </Route>

          <Route path='/view/:resumeId' element={<Preview />} />
          <Route path='/payment/:resumeId' element={<Payment />} />
          <Route path='forgot-password' element={<ForgotPassword />} />
          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/print' element={<PrintResume />} />

        </Routes>
      </Suspense>
    </>
  )
}

export default App
