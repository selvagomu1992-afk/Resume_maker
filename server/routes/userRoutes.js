import express from "express";
import { getUserById, getUserResumes, loginUser, registerUser, forgotPassword, resetPassword } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserById);
userRouter.get('/resumes', protect, getUserResumes);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

// GET /api/users/payment-amount — returns this user's effective payment amount
userRouter.get('/payment-amount', protect, async (req, res) => {
    try {
        const user = await User.findById(req.userId).lean();
        const globalAmount = parseFloat(process.env.PAYMENT_AMOUNT || '49');
        const amount = user?.customPaymentAmount ?? globalAmount;
        return res.json({ success: true, amount });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// GET /api/users/max-downloads — returns this user's effective max downloads
userRouter.get('/max-downloads', protect, async (req, res) => {
    try {
        const user = await User.findById(req.userId).lean();
        const globalMax = parseInt(process.env.MAX_DOWNLOADS || '3', 10);
        const maxDownloads = user?.customMaxDownloads ?? globalMax;
        return res.json({ success: true, maxDownloads });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

export default userRouter;