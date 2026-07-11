// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.SMTP_USER_EMAIL,
//         pass: process.env.SMTP_USER_PASS
//     }
// });

// const sendOrderEmail = async (order) => {
//     try {
//         const orderDateStr = new Date(order.created_at || Date.now()).toLocaleDateString("en-US", {
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit"
//         });

//         // Generate items HTML table rows
//         const itemsRows = order.items.map((item, idx) => {
//             const sizeText = item.size ? `<span style="font-size:12px; color:#777;">Size: ${item.size}</span>` : "";
//             const colorText = item.color ? `<span style="font-size:12px; color:#777; margin-left:8px;">Color: ${item.color}</span>` : "";
//             const details = [sizeText, colorText].filter(Boolean).join(" | ");

//             let imgUrl = item.image || "";
//             if (imgUrl && !imgUrl.startsWith("http://") && !imgUrl.startsWith("https://")) {
//                 const clientUrl = "http://localhost:5173";
//                 imgUrl = `${clientUrl}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
//             }

//             return `
//             <tr>
//                 <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: left; vertical-align: middle;">
//                     <img src="${imgUrl}" alt="${item.title}" width="50" style="border-radius: 4px; display: inline-block; vertical-align: middle; margin-right: 10px;" />
//                     <div style="display: inline-block; vertical-align: middle;">
//                         <span style="font-weight: 600; color: #2d3748; display: block;">${item.title}</span>
//                         ${details ? `<div style="margin-top: 3px;">${details}</div>` : ""}
//                     </div>
//                 </td>
//                 <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: center; color: #4a5568;">
//                     ${item.quantity}
//                 </td>
//                 <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: 600; color: #2d3748;">
//                     $${item.price.toFixed(2)}
//                 </td>
//                 <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: 700; color: #e53637;">
//                     $${(item.price * item.quantity).toFixed(2)}
//                 </td>
//             </tr>
//             `;
//         }).join("");

//         const htmlContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <meta charset="utf-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Order Confirmation - ShopNow</title>
//             <style>
//                 body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 0; }
//                 .wrapper { width: 100%; background-color: #f7fafc; padding: 30px 0; }
//                 .container { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0; }
//                 .header { background-color: #111111; padding: 25px; text-align: center; }
//                 .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
//                 .banner { background-color: #e53637; padding: 15px; text-align: center; color: #ffffff; font-weight: 700; font-size: 16px; letter-spacing: 0.5px; }
//                 .content { padding: 30px; color: #2d3748; }
//                 .content h2 { font-size: 20px; font-weight: 700; margin-top: 0; color: #111111; border-bottom: 2px solid #f7fafc; padding-bottom: 10px; }
//                 .order-meta-table { width: 100%; margin-bottom: 25px; border-collapse: collapse; }
//                 .order-meta-table td { padding: 6px 0; font-size: 14px; color: #718096; }
//                 .order-meta-table td.strong { font-weight: 700; color: #2d3748; text-align: right; }
//                 .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
//                 .items-table th { background-color: #f7fafc; padding: 10px 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #718096; text-align: left; border-bottom: 2px solid #edf2f7; }
//                 .address-box { background-color: #f7fafc; border-radius: 6px; padding: 15px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.5; color: #4a5568; }
//                 .footer { padding: 25px 30px; background-color: #f7fafc; font-size: 12px; color: #718096; text-align: center; border-top: 1px solid #edf2f7; }
//                 .footer p { margin: 5px 0; }
//             </style>
//         </head>
//         <body>
//             <div class="wrapper">
//                 <div class="container">
//                     <!-- Branding Header -->
//                     <div class="header">
//                         <h1>ShopNow</h1>
//                     </div>
//                     <!-- Announcement banner -->
//                     <div class="banner">
//                         ORDER CONFIRMED & PLACED SUCCESSFULLY!
//                     </div>
                    
//                     <div class="content">
//                         <h2>Thank you for your order!</h2>
//                         <p>Hi ${order.billingAddress.reciver},</p>
//                         <p>We've received your order and are getting it ready for shipment. Below are the billing details and summarized item receipts for your purchase.</p>
                        
//                         <!-- Order Meta Info -->
//                         <table class="order-meta-table">
//                             <tr>
//                                 <td>Order Number:</td>
//                                 <td class="strong">#${order._id}</td>
//                             </tr>
//                             <tr>
//                                 <td>Order Date:</td>
//                                 <td class="strong">${orderDateStr}</td>
//                             </tr>
//                             <tr>
//                                 <td>Payment Method:</td>
//                                 <td class="strong">${order.paymentMethod.toUpperCase()}</td>
//                             </tr>
//                         </table>
                        
//                         <!-- Items Table -->
//                         <table class="items-table">
//                             <thead>
//                                 <tr>
//                                     <th style="text-align: left;">Product</th>
//                                     <th style="text-align: center; width: 60px;">Qty</th>
//                                     <th style="text-align: right; width: 80px;">Price</th>
//                                     <th style="text-align: right; width: 80px;">Total</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 ${itemsRows}
//                                 <tr>
//                                     <td colspan="2" style="border-top: 2px solid #edf2f7;"></td>
//                                     <td style="padding: 12px 6px; border-top: 2px solid #edf2f7; font-weight: 700; text-align: right; color: #2d3748;">Subtotal:</td>
//                                     <td style="padding: 12px; border-top: 2px solid #edf2f7; font-weight: 700; text-align: right; color: #2d3748;">$${order.totalAmount.toFixed(2)}</td>
//                                 </tr>
//                                 <tr>
//                                     <td colspan="2"></td>
//                                     <td style="padding: 6px; font-weight: 700; text-align: right; color: #2d3748; font-size: 16px;">Total:</td>
//                                     <td style="padding: 12px; font-weight: 800; text-align: right; color: #e53637; font-size: 18px;">$${order.totalAmount.toFixed(2)}</td>
//                                 </tr>
//                             </tbody>
//                         </table>
                        
//                         <!-- Delivery Address Info -->
//                         <h3 style="font-size: 16px; margin-bottom: 10px;">Delivery Address</h3>
//                         <div class="address-box">
//                             <strong>${order.billingAddress.reciver}</strong><br />
//                             ${order.billingAddress.addressLine1}<br />
//                             ${order.billingAddress.city}, ${order.billingAddress.state} - ${order.billingAddress.pincode}<br />
//                             ${order.billingAddress.country}<br />
//                             Phone: ${order.billingAddress.phone}
//                         </div>
//                     </div>
                    
//                     <!-- Regards & footer info -->
//                     <div class="footer">
//                         <p>If you have any questions, feel free to contact us at support@shopnow.com</p>
//                         <p>&copy; ${new Date().getFullYear()} ShopNow Inc. All rights reserved.</p>
//                     </div>
//                 </div>
//             </div>
//         </body>
//         </html>
//         `;

//         const textContent = `Thank you for your order!\n\nOrder Number: #${order._id}\nTotal: $${order.totalAmount.toFixed(2)}\nPayment: ${order.paymentMethod.toUpperCase()}\nDelivery to: ${order.billingAddress.reciver}\n\nShopNow Team`;

//         const mailOptions = {
//             from: '"ShopNow Receipts" <receipts.shopnow@gmail.com>',
//             to: order.email,
//             subject: `ShopNow Order Confirmation - #${order._id}`,
//             text: textContent,
//             html: htmlContent
//         };

//         const info = await transporter.sendMail(mailOptions);
//         return { status: true, message: "Order email sent", info: info.messageId };
//     } catch (err) {
//         console.error("Failed to send order email:", err);
//         return { status: false, error: err };
//     }
// };

// module.exports = sendOrderEmail;





const emailjs = require("@emailjs/nodejs");

const sendOrderEmail = async (order) => {
    try {
        // 1. Programmatically generate the HTML items blocks matching your design loop
        const itemsBlocks = order.items.map((item) => {
            let imgUrl = item.image || "";
            if (imgUrl && !imgUrl.startsWith("http://") && !imgUrl.startsWith("https://")) {
                const clientUrl = process.env.NODE_ENV === 'production' 
                    ? 'https://vercel.app' 
                    : 'http://localhost:5173';
                imgUrl = `${clientUrl}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
            }

            const sizeText = item.size ? ` | Size: ${item.size}` : "";
            const colorText = item.color ? ` | Color: ${item.color}` : "";

            return `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
                <tr style="vertical-align: top">
                    <td style="padding: 24px 8px 0 4px; display: inline-block; width: max-content">
                        <img style="height: 64px" height="64px" src=${item.image} alt="${item.title || 'item'}" />
                    </td>
                    <td style="padding: 24px 8px 0 8px; width: 100%; text-align: left;">
                        <div>${item.title}</div>
                        <div style="font-size: 14px; color: #888; padding-top: 4px">
                            QTY: ${item.quantity}${sizeText}${colorText}
                        </div>
                    </td>
                    <td style="padding: 24px 4px 0 0; white-space: nowrap; text-align: right;">
                        <strong>$${item.price.toFixed(2)}</strong>
                    </td>
                </tr>
            </table>
            `;
        }).join("");

        // 2. Set up fallback calculation values safely
        const shippingCost = typeof order.shippingCost === 'number' ? order.shippingCost : 0.00;
        const taxCost = typeof order.taxCost === 'number' ? order.taxCost : 0.00;
        const totalCost = order.totalAmount || 0.00;

        // 3. Map parameters to perfectly match your EmailJS web dashboard template variables
        
        const templateParams = {
            order_id: order._id,
            to_email: order.billingAddress.email || order.email,
            email: order.billingAddress.email || order.email,
            shipping: shippingCost.toFixed(2),
            tax: taxCost.toFixed(2),
            total: totalCost.toFixed(2),
            itemsBlocks: itemsBlocks,// Injects the generated item rows straight in
            order_status: " Your Order is confirmed",
            order_message: "Thank you for shopping with us! We’re getting your order ready and will notify you as soon as it ships.",
            customer_name: order.billingAddress.reciver || "Valued Customer",
        };

        // 4. Send payload to EmailJS
        const response = await emailjs.send(
            process.env.EMAIL_JS_SERVICE_ID,   
            process.env.EMAIL_JS_ORDER_TEMPLATE_ID, 
            templateParams,
            {
                publicKey: process.env.EMAIL_JS_PUBLIC_KEY,   
                privateKey: process.env.EMAIL_JS_PRIVATE_KEY, 
            }
        );

        return { status: true, message: 'Order confirmation sent successfully via EmailJS!', info: response };

    } catch (error) {
        console.error('Error sending order email via EmailJS:', error);
        return { status: false, message: 'Failed to send order email!', info: error };
    }
};

module.exports = sendOrderEmail;
