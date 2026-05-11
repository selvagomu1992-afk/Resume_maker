import express from 'express'
import { adminLogin, getAllUsers, getStats, getPaymentAmount, updatePaymentAmount, downloadPayments, updateUserPayment } from '../controllers/adminController.js'
import adminProtect from '../middlewares/adminMiddleware.js'

const adminRouter = express.Router()

adminRouter.post('/login', adminLogin)
adminRouter.get('/users', adminProtect, getAllUsers)
adminRouter.get('/stats', adminProtect, getStats)
adminRouter.get('/payment-amount', getPaymentAmount)
adminRouter.put('/payment-amount', adminProtect, updatePaymentAmount)
adminRouter.get('/download-payments', adminProtect, downloadPayments)
adminRouter.put('/user/:userId/payment', adminProtect, updateUserPayment)

export default adminRouter
