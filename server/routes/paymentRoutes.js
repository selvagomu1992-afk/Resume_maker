import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createOrder } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

paymentRouter.post('/create-order', protect, createOrder);

export default paymentRouter;
