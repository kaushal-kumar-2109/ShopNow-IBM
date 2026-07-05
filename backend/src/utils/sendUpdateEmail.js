const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER_EMAIL,
        pass: process.env.SMTP_USER_PASS
    }
});

const sendUpdateEmail = async (order) => {
    try {
        const orderDateStr = new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        // Generate items HTML table rows
        const itemsRows = order.items.map((item, idx) => {
            const sizeText = item.size ? `<span style="font-size:12px; color:#777;">Size: ${item.size}</span>` : "";
            const colorText = item.color ? `<span style="font-size:12px; color:#777; margin-left:8px;">Color: ${item.color}</span>` : "";
            const details = [sizeText, colorText].filter(Boolean).join(" | ");

            let imgUrl = item.image || "";
            if (imgUrl && !imgUrl.startsWith("http://") && !imgUrl.startsWith("https://")) {
                const clientUrl = "http://localhost:5173";
                imgUrl = `${clientUrl}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
            }

            return `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: left; vertical-align: middle;">
                    <img src="${imgUrl}" alt="${item.title}" width="50" style="border-radius: 4px; display: inline-block; vertical-align: middle; margin-right: 10px;" />
                    <div style="display: inline-block; vertical-align: middle;">
                        <span style="font-weight: 600; color: #2d3748; display: block;">${item.title}</span>
                        ${details ? `<div style="margin-top: 3px;">${details}</div>` : ""}
                    </div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: center; color: #4a5568;">
                    ${item.quantity}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: 600; color: #2d3748;">
                    $${item.price.toFixed(2)}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: 700; color: #e53637;">
                    $${(item.price * item.quantity).toFixed(2)}
                </td>
            </tr>
            `;
        }).join("");

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Items Updated - ShopNow</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 0; }
                .wrapper { width: 100%; background-color: #f7fafc; padding: 30px 0; }
                .container { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0; }
                .header { background-color: #111111; padding: 25px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
                .banner { background-color: #111; padding: 15px; text-align: center; color: #ffffff; font-weight: 700; font-size: 16px; letter-spacing: 0.5px; }
                .content { padding: 30px; color: #2d3748; }
                .content h2 { font-size: 20px; font-weight: 700; margin-top: 0; color: #111111; border-bottom: 2px solid #f7fafc; padding-bottom: 10px; }
                .order-meta-table { width: 100%; margin-bottom: 25px; border-collapse: collapse; }
                .order-meta-table td { padding: 6px 0; font-size: 14px; color: #718096; }
                .order-meta-table td.strong { font-weight: 700; color: #2d3748; text-align: right; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                .items-table th { background-color: #f7fafc; padding: 10px 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #718096; text-align: left; border-bottom: 2px solid #edf2f7; }
                .address-box { background-color: #f7fafc; border-radius: 6px; padding: 15px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.5; color: #4a5568; }
                .footer { padding: 25px 30px; background-color: #f7fafc; font-size: 12px; color: #718096; text-align: center; border-top: 1px solid #edf2f7; }
                .footer p { margin: 5px 0; }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <!-- Branding Header -->
                    <div class="header">
                        <h1>ShopNow</h1>
                    </div>
                    <!-- Announcement banner -->
                    <div class="banner" style="background-color: #3182ce;">
                        ORDER ITEMS UPDATED SUCCESSFULLY
                    </div>
                    
                    <div class="content">
                        <h2>Order Update Details</h2>
                        <p>Hi ${order.billingAddress.reciver},</p>
                        <p>This email confirms that the items in your order have been updated successfully as requested. Below is your updated order details invoice.</p>
                        
                        <!-- Order Meta Info -->
                        <table class="order-meta-table">
                            <tr>
                                <td>Order Number:</td>
                                <td class="strong">#${order._id}</td>
                            </tr>
                            <tr>
                                <td>Update Date:</td>
                                <td class="strong">${orderDateStr}</td>
                            </tr>
                            <tr>
                                <td>New Order Total:</td>
                                <td class="strong" style="color: #e53637; font-size: 16px;">$${order.totalAmount.toFixed(2)}</td>
                            </tr>
                        </table>
                        
                        <!-- Items Table -->
                        <h3 style="font-size: 16px; margin-bottom: 10px;">Updated Items List</h3>
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th style="text-align: left;">Product</th>
                                    <th style="text-align: center; width: 60px;">Qty</th>
                                    <th style="text-align: right; width: 80px;">Price</th>
                                    <th style="text-align: right; width: 80px;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsRows}
                            </tbody>
                        </table>

                        <!-- Delivery Address Info -->
                        <h3 style="font-size: 16px; margin-bottom: 10px;">Delivery Address</h3>
                        <div class="address-box">
                            <strong>${order.billingAddress.reciver}</strong><br />
                            ${order.billingAddress.addressLine1}<br />
                            ${order.billingAddress.city}, ${order.billingAddress.state} - ${order.billingAddress.pincode}<br />
                            ${order.billingAddress.country}<br />
                            Phone: ${order.billingAddress.phone}
                        </div>
                    </div>
                    
                    <!-- Regards & footer info -->
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} ShopNow Inc. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        const textContent = `Your order has been updated successfully.\n\nOrder Number: #${order._id}\nNew Total: $${order.totalAmount.toFixed(2)}\n\nShopNow Team`;

        const mailOptions = {
            from: '"ShopNow Receipts" <receipts.shopnow@gmail.com>',
            to: order.email,
            subject: `ShopNow Order Updated - #${order._id}`,
            text: textContent,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        return { status: true, message: "Update confirmation email sent", info: info.messageId };
    } catch (err) {
        console.error("Failed to send update confirmation email:", err);
        return { status: false, error: err };
    }
};

module.exports = sendUpdateEmail;
