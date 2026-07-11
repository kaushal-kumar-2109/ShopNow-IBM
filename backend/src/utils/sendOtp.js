// const nodemailer = require("nodemailer");

// // 1. Create a transporter object using Gmail SMTP
// // const transporter = nodemailer.createTransport({
// //     service: 'gmail',
// //     auth: {
// //         user: process.env.SMTP_USER_EMAIL,
// //         pass: process.env.SMTP_USER_PASS
// //     }
// // });
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true, // true for port 465
//   auth: {
//       user: process.env.SMTP_USER_EMAIL,
//       pass: process.env.SMTP_USER_PASS
//   },
//   // Add this line to force IPv4 connection
//   connectionTimeout: 10000, 
// });

// // 2. Define the email options
// const createMailOptions = (email, otp, tag) => {
//     // 1. Determine dynamic text based on the tag (login or signup)
//     const isSignup = (tag.toLowerCase() === 'signup') ? true : false;
//     const actionText = isSignup ? 'creating your ShopNow account' : 'recover your ShopNow account';
//     const subjectText = isSignup ? 'Verify your ShopNow Account' : 'ShopNow Account Recovery';
//     const headingText = isSignup ? 'Verify Your Account' : 'Welcome Back!';

//     // 2. Build the professional HTML layout
//     const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="utf-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>${subjectText}</title>
//         <style>
//             body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
//             .wrapper { width: 100%; table-layout: fixed; background-color: #f4f5f7; padding: 40px 0; }
//             .container { max-width: 500px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e1e4e8; }
//             .header { background-color: #4F46E5; padding: 30px; text-align: center; }
//             .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
//             .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
//             .content p { font-size: 15px; margin: 0 0 20px 0; color: #4A5568; }
//             .otp-container { background-color: #F3F4F6; border: 1px dashed #4F46E5; border-radius: 6px; padding: 16px; text-align: center; margin: 30px 0; }
//             .otp-code { font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #4F46E5; margin: 0; font-family: 'Courier New', Courier, monospace; }
//             .footer { padding: 0 30px 40px 30px; font-size: 13px; color: #718096; border-top: 1px solid #EDF2F7; padding-top: 20px; }
//             .footer p { margin: 0 0 8px 0; }
//             .company { font-weight: 600; color: #4A5568; }
//         </style>
//     </head>
//     <body>
//         <div class="wrapper">
//             <div class="container">
//                 <!-- Header / Branding -->
//                 <div class="header">
//                     <h1>ShopNow, "${headingText}"</h1>
//                 </div>

//                 <!-- Main Body Content -->
//                 <div class="content">
//                     <p>Hello,</p>
//                     <p>Thank you for choosing ShopNow! You are receiving this email because a request was made for <strong>${actionText}</strong>.</p>
//                     <p>Please use the verification code below to complete your authentication. This code is valid for the next 10 minutes.</p>

//                     <!-- OTP Display Box -->
//                     <div class="otp-container">
//                         <h2 class="otp-code">${otp}</h2>
//                     </div>

//                     <p>If you did not make this request, you can safely ignore this email. Your account remains secure.</p>
//                 </div>

//                 <!-- Professional Regards & Footer -->
//                 <div class="footer">
//                     <p>Best regards,</p>
//                     <p class="company">The ShopNow Security Team</p>
//                     <p style="font-size: 11px; color: #A0AEC0; margin-top: 20px;">This is an automated system message. Please do not reply directly to this email.</p>
//                 </div>
//             </div>
//         </div>
//     </body>
//     </html>
//     `;

//     // 3. Fallback plain text version for non-HTML mail clients
//     const textContent = `Hello,\n\nThank you for choosing ShopNow! Your verification code for ${actionText} is: ${otp}\n\nThis code is valid for 10 minutes. If you did not request this code, please disregard this email.\n\nBest regards,\nThe ShopNow Security Team`;

//     return {
//         from: '"ShopNow Team" <ShopNow.service@gmail.com>',
//         to: email,
//         subject: subjectText,
//         text: textContent,
//         html: htmlContent
//     };
// };

// // 3. Send the email
// const SendOTP = async (email, otp, tag = "signup") => {
//     const mailOptions = createMailOptions(email, otp, tag);
//     try {
//         const info = await transporter.sendMail(mailOptions);
//         return ({ status: true, message: 'Email sent successfully!', info: info.messageId });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         return ({ status: false, message: 'Failed to send email!', info: error });
//     }
// }

// module.exports = SendOTP;
const emailjs = require("@emailjs/nodejs");



const CREATE_OTP_BODY = (otp, headingText, actionText) => {
    return `
        <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f5f7; padding: 40px 0; }
        .container { max-width: 500px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e1e4e8; }
        .header { background-color: #4F46E5; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
        .content p { font-size: 15px; margin: 0 0 20px 0; color: #4A5568; }
        .otp-container { background-color: #F3F4F6; border: 1px dashed #4F46E5; border-radius: 6px; padding: 16px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #4F46E5; margin: 0; font-family: 'Courier New', Courier, monospace; }
        .footer { padding: 0 30px 40px 30px; font-size: 13px; color: #718096; border-top: 1px solid #EDF2F7; padding-top: 20px; }
        .footer p { margin: 0 0 8px 0; }
        .company { font-weight: 600; color: #4A5568; }
    </style>
    <div class="wrapper">
        <div class="container">
            <!-- Header / Branding -->
            <div class="header">
                <h1>ShopNow, ${headingText}</h1>
            </div>

            <!-- Main Body Content -->
            <div class="content">
                <p>Hello,</p>
                <p>Thank you for choosing ShopNow! You are receiving this email because a request was made for <strong>${actionText}</strong>.</p>
                <p>Please use the verification code below to complete your authentication. This code is valid for the next 10 minutes.</p>

                <!-- OTP Display Box -->
                <div class="otp-container">
                    <h2 class="otp-code">${otp}</h2>
                </div>

                <p>If you did not make this request, you can safely ignore this email. Your account remains secure.</p>
            </div>

            <!-- Professional Regards & Footer -->
            <div class="footer">
                <p>Best regards,</p>
                <p class="company">The ShopNow Security Team</p>
                <p style="font-size: 11px; color: #A0AEC0; margin-top: 20px;">This is an automated system message. Please do not reply directly to this email.</p>
            </div>
        </div>
    </div>
`
}

const CREATE_WARNING_BODY = (email) => {
    return `
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f5f7; padding: 40px 0; }
        .container { max-width: 500px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e1e4e8; }
        .header { background-color: #DC2626; padding: 30px; text-align: center; } /* Warning Crimson Red */
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
        .content p { font-size: 15px; margin: 0 0 20px 0; color: #4A5568; }
        
        /* Device Metadata Card styling */
        .device-container { background-color: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 6px; padding: 20px; margin: 30px 0; }
        .device-title { font-size: 14px; font-weight: 700; color: #DC2626; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .device-info-row { font-size: 14px; margin-bottom: 6px; color: #4A5568; }
        .device-info-row strong { color: #1F2937; }
        
        /* High-importance action button */
        .btn-action { display: block; background-color: #DC2626; color: #ffffff !important; text-decoration: none; text-align: center; padding: 14px; border-radius: 6px; font-weight: 600; margin: 30px 0 15px 0; font-size: 15px; }
        
        .footer { padding: 0 30px 40px 30px; font-size: 13px; color: #718096; border-top: 1px solid #EDF2F7; padding-top: 20px; }
        .footer p { margin: 0 0 8px 0; }
        .company { font-weight: 600; color: #4A5568; }
    </style>
    <div class="wrapper">
        <div class="container">
            <!-- Header / Branding (Red background implies high security priority) -->
            <div class="header">
                <h1>ShopNow Security Alert</h1>
            </div>

            <!-- Main Body Content -->
            <div class="content">
                <p>Hello ${email || 'User'},</p>
                <p>We noticed a login attempt to your ShopNow account from a completely unrecognized device or browser environment.</p>
                <p>Please review the details below carefully to ensure this activity was authorized</p>


                <p>If this was you, you can safely disregard this message. No further security actions are needed from your end.</p>
                
                <p style="margin-bottom: 5px;"><strong>Was this not you?</strong></p>
                <p>If you do not recognize this activity, your account password may be compromised. Click the button below immediately to lock all active sessions and reset your password.</p>

                <!-- Critical Action Link -->
                <a href="https://shop-now-neon.vercel.app/recover-password" class="btn-action" target="_blank">Secure My Account Now</a>
            </div>

            <!-- Professional Regards & Footer -->
            <div class="footer">
                <p>Best regards,</p>
                <p class="company">The ShopNow Security Team</p>
                <p style="font-size: 11px; color: #A0AEC0; margin-top: 20px;">This is an automated system security message. Please do not reply directly to this email.</p>
            </div>
        </div>
    </div>
`
}

// 1. Helper function to generate data variables
const getTemplateParams = (email, otp, tag) => {
    let headingText, actionText;
    const isSignup = (tag.toLowerCase() === 'signup');
    if (tag) {
        headingText = isSignup ? 'Verify Your Account' : 'Welcome Back!';
        actionText = isSignup ? 'creating your ShopNow account' : 'recover your ShopNow account';
    }
    const htmlBody = otp ? CREATE_OTP_BODY(otp, headingText, actionText) : CREATE_WARNING_BODY(email);
    return {
        // These keys must match the exact {{variable_names}} you typed in your  template
        to_email: email,
        email: email,
        html_body: htmlBody,
        subjectText: otp ? (isSignup ? 'Verify your ShopNow Account' : 'ShopNow Account Recovery') : 'Suspicious Activity Detected on ShopNow',
    };
};

// 2. Send the email via EmailJS API
const SendOTP = async (email, otp, tag = "signup") => {
    const templateParams = getTemplateParams(email, otp, tag);

    try {
        const response = await emailjs.send(
            process.env.EMAIL_JS_SERVICE_ID,   // Your Service ID (e.g., service_xxxx)
            process.env.EMAIL_JS_TEMPLATE_ID,  // Your Template ID (e.g., template_xxxx)
            templateParams,
            {
                publicKey: process.env.EMAIL_JS_PUBLIC_KEY,   // Your Public Key
                privateKey: process.env.EMAIL_JS_PRIVATE_KEY, // Your Private Key
            }
        );

        return { status: true, message: 'Email sent successfully!', info: response };
    } catch (error) {
        console.error('Error sending email via EmailJS:', error);
        return { status: false, message: 'Failed to send email!', info: error };
    }
};

module.exports = SendOTP;
