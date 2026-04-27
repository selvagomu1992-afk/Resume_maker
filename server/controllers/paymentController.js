import { Cashfree, CFEnvironment } from "cashfree-pg";

export const createOrder = async (req, res) => {
    try {
        const { resumeId } = req.body;
        
        // Generate a unique order ID
        const orderId = `order_${Date.now()}_${resumeId || Math.floor(Math.random()*1000)}`;
        
        const request = {
            order_amount: 49.00,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: req.userId || "user_checkout",
                customer_phone: "9999999999",
                customer_name: "Resume User"
            }
        };

        const cashfree = new Cashfree(
            CFEnvironment.PRODUCTION, 
            process.env.CASHFREE_APPID, 
            process.env.CASHFREE_SECRET_KEY
        );

        const response = await cashfree.PGCreateOrder(request);
        
        res.json({ success: true, payment_session_id: response.data.payment_session_id, order_id: response.data.order_id });
    } catch (error) {
        console.error("Cashfree Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}
