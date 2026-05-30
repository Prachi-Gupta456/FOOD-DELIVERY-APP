import transporter from "../config/nodemailer.js"

const sendMail = async (otp, email) => {
    
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset OTP",
        text: `Hello 👋,

We received a request to reset the password for your account.

Use the OTP below to proceed with resetting your password:

🔐 Your OTP Code: ${otp}

This code will expire in 10 minutes for security reasons.

If you did not request this password reset, you can safely ignore this email. Your account will remain secure.
Thanks,
FoodSutra`
    }

    await transporter.sendMail(mailOptions)
}

export const sendDeliveryOTPMail = async (otp, email) => {
   
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset OTP",
        text: `Delivery OTP: ${otp}.
        This otp will expire in 5 minutes for security reasons.
        SwadSutra`
    }

    await transporter.sendMail(mailOptions)
}

export default sendMail;