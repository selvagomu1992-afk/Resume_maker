import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume } from "../controllers/resumeController.js";
import upload from "../configs/multer.js";
import Resume from "../models/Resume.js";

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);

// POST /api/resumes/download/:resumeId
// Called when user clicks Download PDF — increments count, resets isPaid after maxDownloads
resumeRouter.post('/download/:resumeId', protect, async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ _id: resumeId, userId: req.userId });

        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        if (!resume.isPaid) return res.status(403).json({ message: 'Not paid' });

        // Get user's custom max or fall back to global env
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.userId).lean();
        const globalMax = parseInt(process.env.MAX_DOWNLOADS || '3', 10);
        const max = user?.customMaxDownloads ?? globalMax;

        const newCount = (resume.downloadCount || 0) + 1;
        const exhausted = newCount >= max;

        await Resume.findByIdAndUpdate(resumeId, {
            downloadCount: exhausted ? 0 : newCount,
            ...(exhausted ? { isPaid: false } : {})
        });

        return res.json({
            success: true,
            downloadCount: exhausted ? 0 : newCount,
            remaining: exhausted ? 0 : max - newCount,
            exhausted,
            maxDownloads: max
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

export default resumeRouter