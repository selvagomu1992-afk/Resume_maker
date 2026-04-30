import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
await connectDB()

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

app.use(express.json())
app.use(cors(
    {
        origin: allowedOrigins,
        credentials: true
    }
))

app.get('/', (req, res) => res.send("Server is live..."))
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/admin', adminRouter)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});