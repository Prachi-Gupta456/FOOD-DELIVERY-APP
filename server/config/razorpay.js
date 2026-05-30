import RazorPay from "razorpay"

const razorpay_instance = new RazorPay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

export default razorpay_instance;