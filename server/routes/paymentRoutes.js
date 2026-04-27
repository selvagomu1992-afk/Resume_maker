import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createOrder } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post('/create-order', protect, createOrder);
paymentRouter.post('/order/webhook', (req, res) => {
    // Handle webhook notification from Cashfree
    // Verify the signature
    // Update order status in database
    // Send response to Cashfree

    // This is a placeholder implementation
    console.log('Cashfree Webhook Received:', req.body);
    res.json({ received: true });
});

export default paymentRouter;   