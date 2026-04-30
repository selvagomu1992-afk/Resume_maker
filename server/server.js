import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import Resume from "./models/Resume.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
await connectDB();

const allowedOrigins = [
    "https://no-01-resume-maker.onrender.com",
    "https://resume-maker.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5176"
];

app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// API routes
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/admin', adminRouter);

// Force-pay: manually set isPaid=true for a resumeId (for testing)
// POST /api/dev/force-pay  { resumeId }
app.post('/api/dev/force-pay', async (req, res) => {
    try {
        const { resumeId } = req.body;
        if (!resumeId) return res.status(400).json({ message: 'resumeId required' });
        const updated = await Resume.findByIdAndUpdate(resumeId, { isPaid: true }, { new: true });
        res.json({ success: true, isPaid: updated?.isPaid, resumeId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve frontend build in production
const frontendBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(frontendBuildPath));

// All non-API routes → serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
