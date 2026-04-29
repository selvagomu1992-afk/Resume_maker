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
            order_amount: 1,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: req.userId || "user_checkout",
                customer_phone: "9999999999",
                customer_name: "Resume User"
            },
            order_meta: {
                return_url: `${req.headers.origin || 'http://localhost:5173'}/app/builder/${resumeId}?order_id={order_id}&payment_status={order_status}`,
                notify_url: `https://resume-maker-backend.onrender.com/api/payment/order/webhook`
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

        if (!orderId || !resumeId) {
            return res.status(400).json({ success: false, message: "Missing orderId or resumeId" });
        }

        // Fetch the order status directly from Cashfree (cannot be faked by client)
        const cashfree = getCashfree();
        const response = await cashfree.PGFetchOrder(orderId);
        const order = response.data;

        console.log("Cashfree order status:", order.order_status);

        if (order.order_status === "PAID") {
            // Mark the resume as paid in the database
            await Resume.findByIdAndUpdate(resumeId, {
                isPaid: true,
                paidOrderId: orderId
            });
            return res.json({ success: true, isPaid: true });
        } else {
            return res.json({ success: false, isPaid: false, status: order.order_status });
        }
    } catch (error) {
        console.error("Verify Payment Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
    }
}
