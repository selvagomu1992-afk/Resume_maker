import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Resume from '../models/Resume.js'

// POST /api/admin/login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Validate against env credentials
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const token = jwt.sign(
            { isAdmin: true, adminId: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({ success: true, token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/admin/users
// Returns all users with their resume count and paid resume count
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password -resetPasswordOtp -resetPasswordOtpExpires').lean();

        // For each user, get resume stats
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const resumes = await Resume.find({ userId: user._id }, 'isPaid createdAt').lean();
                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    totalResumes: resumes.length,
                    paidResumes: resumes.filter(r => r.isPaid).length,
                    paidAmount: resumes.filter(r => r.isPaid).length * 49,
                };
            })
        );

        return res.status(200).json({ success: true, users: usersWithStats });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/admin/stats
// Returns overall platform stats
export const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalResumes = await Resume.countDocuments();
        const paidResumes = await Resume.countDocuments({ isPaid: true });
        const totalRevenue = paidResumes * 49; // ₹49 per resume

        return res.status(200).json({
            success: true,
            stats: { totalUsers, totalResumes, paidResumes, totalRevenue }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
