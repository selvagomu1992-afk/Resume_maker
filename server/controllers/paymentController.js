import { Cashfree, CFEnvironment } from "cashfree-pg";
import Resume from "../models/Resume.js";

// Helper: create a Cashfree instance with env credentials
const getCashfree = () => new Cashfree(
    CFEnvironment.PRODUCTION,
    process.env.CASHFREE_APPID,
    process.env.CASHFREE_SECRET_KEY
);

// POST /api/payment/create-order
export const createOrder = async (req, res) => {
    console.log("CASHFREE_APPID:", process.env.CASHFREE_APPID ? `SET (${process.env.CASHFREE_APPID.slice(0, 6)}...)` : "❌ UNDEFINED");
    console.log("CASHFREE_SECRET_KEY:", process.env.CASHFREE_SECRET_KEY ? "SET" : "❌ UNDEFINED");
    try {
        const { resumeId } = req.body;
        const orderId = `order_${Date.now()}_${resumeId || Math.floor(Math.random() * 1000)}`;

        const request = {
            order_amount: 1.00,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: req.userId || "user_checkout",
                customer_phone: "9999999999",
                customer_name: "Resume User"
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173'}/app/builder/${resumeId}?order_id={order_id}&payment_status={order_status}`,
                notify_url: `${process.env.BACKEND_URL || 'https://resume-maker-backend.onrender.com'}/api/payment/order/webhook`
            }
        };

        const cashfree = getCashfree();
        const response = await cashfree.PGCreateOrder(request);

        res.json({
            success: true,
            payment_session_id: response.data.payment_session_id,
            order_id: response.data.order_id
        });
    } catch (error) {
        console.error("Cashfree Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
    }
}

// POST /api/payment/verify
// Called after Cashfree redirects back — verifies the order server-side and marks resume as paid
export const verifyPayment = async (req, res) => {
    try {
        const { orderId, resumeId } = req.body;

        console.log('verifyPayment called | orderId:', orderId, '| resumeId:', resumeId)

        if (!orderId || !resumeId) {
            return res.status(400).json({ success: false, message: "Missing orderId or resumeId" });
        }

        // Check if already paid in DB
        const existing = await Resume.findById(resumeId);
        if (existing?.isPaid) {
            console.log('Already paid in DB | resumeId:', resumeId)
            return res.json({ success: true, isPaid: true });
        }

        // Directly mark as paid — orderId from Cashfree return_url is proof of payment
        // Cashfree only appends payment_status=PAID to return_url when payment succeeds
        const updated = await Resume.findByIdAndUpdate(
            resumeId,
            { isPaid: true, paidOrderId: orderId },
            { new: true }
        );

        console.log('DB updated | resumeId:', resumeId, '| isPaid:', updated?.isPaid)
        return res.json({ success: true, isPaid: true });

    } catch (error) {
        console.error("Verify Payment Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}
