import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";
import Resume from "../models/Resume.js";

const paymentRouter = express.Router();

paymentRouter.post('/create-order', protect, createOrder);
paymentRouter.post('/verify', verifyPayment);
paymentRouter.post('/order/webhook', async (req, res) => {
    try {
        console.log('Cashfree Webhook Received:', JSON.stringify(req.body));
        const event = req.body;

        // Cashfree sends order.paid event when payment is successful
        const orderStatus = event?.data?.order?.order_status;
        const orderId = event?.data?.order?.order_id;

        console.log('Webhook orderStatus:', orderStatus, '| orderId:', orderId);

        if (orderStatus === 'PAID' && orderId) {
            // orderId format: order_<timestamp>_<resumeId>
            // Use slice(2).join to safely get resumeId even if it had underscores
            const parts = orderId.split('_');
            const resumeId = parts.slice(2).join('_');

            console.log('Webhook parsed resumeId:', resumeId);

            if (resumeId && resumeId.length === 24) {
                const updated = await Resume.findByIdAndUpdate(
                    resumeId,
                    { isPaid: true, paidOrderId: orderId },
                    { new: true }
                );
                console.log('Webhook DB updated | resumeId:', resumeId, '| isPaid:', updated?.isPaid);
            } else {
                console.log('Webhook: invalid resumeId:', resumeId);
            }
        }
        res.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.json({ received: true });
    }
});

export default paymentRouter;