import express from 'express'
import { adminLogin, getAllUsers, getStats, getPaymentAmount, updatePaymentAmount, downloadPayments } from '../controllers/adminController.js'
import adminProtect from '../middlewares/adminMiddleware.js'

const adminRouter = express.Router()

adminRouter.post('/login', adminLogin)
adminRouter.get('/users', adminProtect, getAllUsers)
adminRouter.get('/stats', adminProtect, getStats)
adminRouter.get('/payment-amount', getPaymentAmount)  // public — used by client to show price
adminRouter.put('/payment-amount', adminProtect, updatePaymentAmount)
adminRouter.get('/download-payments', adminProtect, downloadPayments)

export default adminRouter
