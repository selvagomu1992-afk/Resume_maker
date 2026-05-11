import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Resume from '../models/Resume.js'
import fs from 'fs'

// POST /api/admin/login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }
        const token = jwt.sign({ isAdmin: true, adminId: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ success: true, token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        const amount = parseFloat(process.env.PAYMENT_AMOUNT || '49');
        const users = await User.find({}, '-password -resetPasswordOtp -resetPasswordOtpExpires').sort({ createdAt: -1 }).lean();
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const resumes = await Resume.find({ userId: user._id }, 'isPaid createdAt title paidOrderId').lean();
                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt,
                    totalResumes: resumes.length,
                    paidResumes: resumes.filter(r => r.isPaid).length,
                    paidAmount: resumes.filter(r => r.isPaid).length * amount,
                    resumes: resumes.map(r => ({ _id: r._id, title: r.title, isPaid: r.isPaid })),
                };
            })
        );
        return res.status(200).json({ success: true, users: usersWithStats });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/admin/stats
export const getStats = async (req, res) => {
    try {
        const amount = parseFloat(process.env.PAYMENT_AMOUNT || '49');
        const totalUsers = await User.countDocuments();
        const totalResumes = await Resume.countDocuments();
        const paidResumes = await Resume.countDocuments({ isPaid: true });
        const totalRevenue = paidResumes * amount;
        return res.status(200).json({
            success: true,
            stats: { totalUsers, totalResumes, paidResumes, totalRevenue }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// GET /api/admin/payment-amount
export const getPaymentAmount = async (req, res) => {
    return res.json({ success: true, amount: parseFloat(process.env.PAYMENT_AMOUNT || '49') });
}

// PUT /api/admin/payment-amount
// Admin updates the payment price — writes to process.env at runtime
export const updatePaymentAmount = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        // Update in-memory env (takes effect immediately without restart)
        process.env.PAYMENT_AMOUNT = String(parseFloat(amount));

        // Also persist to .env file so it survives restarts
        try {
            const envPath = new URL('../.env', import.meta.url).pathname;
            let envContent = fs.readFileSync(envPath, 'utf8');
            if (envContent.includes('PAYMENT_AMOUNT=')) {
                envContent = envContent.replace(/PAYMENT_AMOUNT=.*/g, `PAYMENT_AMOUNT=${amount}`);
            } else {
                envContent += `\nPAYMENT_AMOUNT=${amount}`;
            }
            fs.writeFileSync(envPath, envContent);
        } catch (e) {
            console.warn('Could not persist PAYMENT_AMOUNT to .env:', e.message);
        }

        return res.json({ success: true, amount: parseFloat(amount) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// PUT /api/admin/user/:userId/payment
// Admin manually sets isPaid for all resumes of a user, or a specific resume
export const updateUserPayment = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isPaid, resumeId } = req.body;

        if (typeof isPaid !== 'boolean') {
            return res.status(400).json({ message: 'isPaid must be true or false' });
        }

        if (resumeId) {
            // Update a specific resume
            await Resume.findOneAndUpdate({ _id: resumeId, userId }, { isPaid });
        } else {
            // Update ALL resumes of this user
            await Resume.updateMany({ userId }, { isPaid });
        }

        return res.json({ success: true, message: `Payment status updated to ${isPaid}` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
// PUT /api/admin/user/:userId/payment — admin manually toggle isPaid
export const updateUserPayment = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isPaid, resumeId } = req.body;
        if (typeof isPaid !== 'boolean') return res.status(400).json({ message: 'isPaid must be true or false' });
        if (resumeId) {
            await Resume.findOneAndUpdate({ _id: resumeId, userId }, { isPaid });
        } else {
            await Resume.updateMany({ userId }, { isPaid });
        }
        return res.json({ success: true, message: `Payment status updated to ${isPaid}` });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Download all paid users as CSV
export const downloadPayments = async (req, res) => {
    try {
        const amount = parseFloat(process.env.PAYMENT_AMOUNT || '49');
        const users = await User.find({}, '-password -resetPasswordOtp -resetPasswordOtpExpires').sort({ createdAt: -1 }).lean();

        const rows = [];
        for (const user of users) {
            const resumes = await Resume.find({ userId: user._id, isPaid: true }, 'title paidOrderId updatedAt').lean();
            if (resumes.length === 0) continue;
            for (const resume of resumes) {
                rows.push({
                    name: user.name,
                    email: user.email,
                    resumeTitle: resume.title || 'Untitled',
                    orderId: resume.paidOrderId || '—',
                    amount: `₹${amount}`,
                    paidOn: new Date(resume.updatedAt).toLocaleDateString('en-IN'),
                });
            }
        }

        const headers = ['Name', 'Email', 'Resume Title', 'Order ID', 'Amount', 'Paid On'];
        const csvRows = [
            headers.join(','),
            ...rows.map(r => [
                `"${r.name}"`, `"${r.email}"`, `"${r.resumeTitle}"`,
                `"${r.orderId}"`, `"${r.amount}"`, `"${r.paidOn}"`
            ].join(','))
        ];

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="payments.csv"');
        return res.send(csvRows.join('\n'));
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
