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

        const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')

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
                return_url: `${frontendUrl}/app/builder/${resumeId}?order_id=${orderId}`,
                notify_url: `${(process.env.BACKEND_URL || 'https://resume-backend-757i.onrender.com').replace(/\/$/, '')}/api/payment/order/webhook`
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
export const verifyPayment = async (req, res) => {
    try {
        const { orderId, resumeId } = req.body;
        console.log('verifyPayment | orderId:', orderId, '| resumeId:', resumeId)

        if (!orderId || !resumeId) {
            return res.status(400).json({ success: false, message: "Missing orderId or resumeId" });
        }

        // Already paid — return immediately
        const existing = await Resume.findById(resumeId);
        if (existing?.isPaid) {
            return res.json({ success: true, isPaid: true });
        }

        // Verify with Cashfree that this order is actually PAID
        const cashfree = getCashfree();
        const response = await cashfree.PGFetchOrder(orderId);
        const orderStatus = response?.data?.order_status;
        console.log('Cashfree order_status:', orderStatus)

        if (orderStatus === 'PAID') {
            const updated = await Resume.findByIdAndUpdate(
                resumeId,
                { isPaid: true, paidOrderId: orderId },
                { new: true }
            );
            console.log('DB updated | isPaid:', updated?.isPaid)
            return res.json({ success: true, isPaid: true });
        } else {
            return res.json({ success: false, isPaid: false, status: orderStatus });
        }
    } catch (error) {
        console.error("Verify Payment Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}
