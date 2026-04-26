import User from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Resume from "../models/Resume.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';


const generateToken = (userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token;
}

// controller for user registration
// POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        // check if required fields are present
        if(!name || !email || !password){
            return res.status(400).json({message: 'Missing required fields'})
        }

        // check if user already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'User already exists'})
        }

        // create new user
         const hashedPassword = await bcrypt.hash(password, 10)
         const newUser = await User.create({
            name, email, password: hashedPassword
         })

         // return success message
         const token = generateToken(newUser._id)
         newUser.password = undefined;

         return res.status(201).json({message: 'User created successfully', token, user: newUser})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for user login
// POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password} = req.body;

        // check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // check if password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // return success message
         const token = generateToken(user._id)
         user.password = undefined;

         return res.status(200).json({message: 'Login successful', token, user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for getting user by id
// GET: /api/users/data
export const getUserById = async (req, res) => {
    try {
        
        const userId = req.userId;

        // check if user exists
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        // return user
        user.password = undefined;
         return res.status(200).json({user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;

        // return user resumes
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for forgot password
// POST: /api/users/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hash OTP for saving to db
        user.resetPasswordOtp = crypto.createHash('sha256').update(otp).digest('hex');
        user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // Setup email transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'selvagomu1992@gmail.com', // fallback user
                pass: process.env.GMAIL_SMTP
            }
        });

        const message = `
            <h2>Password Reset OTP</h2>
            <p>Your OTP for password reset is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 10 minutes.</p>
        `;

        try {
            await transporter.sendMail({
                to: user.email,
                subject: 'Password Reset OTP',
                html: message
            });

            res.status(200).json({ message: 'OTP sent successfully to your email' });
        } catch (error) {
            user.resetPasswordOtp = undefined;
            user.resetPasswordOtpExpires = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// controller for reset password
// POST: /api/users/reset-password
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        
        if(!email || !otp || !password) {
             return res.status(400).json({ message: 'Email, OTP, and new password are required' });
        }

        const hashedOtp = crypto.createHash('sha256').update(otp.toString()).digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordOtp: hashedOtp,
            resetPasswordOtpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}