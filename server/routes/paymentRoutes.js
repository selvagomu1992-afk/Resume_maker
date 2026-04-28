import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createOrder } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post('/create-order', protect, createOrder);
paymentRouter.post('/order/webhook', (req, res) => {

    console.log('Cashfree Webhook Received:', req.body);
    res.json({ received: true });
});

export default paymentRouter;   