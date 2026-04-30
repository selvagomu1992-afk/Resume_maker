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
        if (event?.data?.order?.order_status === 'PAID') {
            const orderId = event.data.order.order_id;
            const resumeId = orderId?.split('_')[2]; // our orderId format: order_<timestamp>_<resumeId>

            if (resumeId) {
                await Resume.findByIdAndUpdate(resumeId, {
                    isPaid: true,
                    paidOrderId: orderId
                });
                console.log('Webhook: DB updated | resumeId:', resumeId, '| isPaid: true');
            }
        }
        res.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err.message);
        res.json({ received: true }); // always 200 to Cashfree
    }
});

export default paymentRouter;