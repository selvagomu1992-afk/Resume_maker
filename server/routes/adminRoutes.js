import express from 'express'
import { adminLogin, getAllUsers, getStats } from '../controllers/adminController.js'
import adminProtect from '../middlewares/adminMiddleware.js'

const adminRouter = express.Router()

adminRouter.post('/login', adminLogin)
adminRouter.get('/users', adminProtect, getAllUsers)
adminRouter.get('/stats', adminProtect, getStats)

export default adminRouter
