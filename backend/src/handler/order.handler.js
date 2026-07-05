const Order = require("../../db/models/order.model.js");
const User = require("../../db/models/user.model.js");
const Cart = require("../../db/models/cart.model.js");
const sendOrderEmail = require("../utils/sendOrderEmail.js");
const sendCancelEmail = require("../utils/sendCancelEmail.js");
const sendUpdateEmail = require("../utils/sendUpdateEmail.js");

const CreateOrder = async (req, res) => {
    try {
        const { items, billingAddress, totalAmount, paymentMethod } = req.body;

        if (!items || items.length === 0 || !billingAddress || !totalAmount || !paymentMethod) {
            return res.status(400).json({ message: "Invalid order details. All fields are required." });
        }

        const user = await User.findOne({ email: req.email });
        if (!user) return res.status(401).json({ message: "User profile not found" });

        // Save order to database
        const order = await Order.create({
            user_id: user._id,
            email: user.email,
            items,
            billingAddress,
            totalAmount,
            paymentMethod,
            status: "Placed"
        });

        // Clear user's cart in the database
        await Cart.deleteOne({ user_id: user._id });

        // Send order receipt email in background asynchronously
        sendOrderEmail(order).then(mailRes => {
            console.log("Invoice email status:", mailRes);
        }).catch(err => {
            console.error("Async invoice email failed:", err);
        });

        return res.status(201).json({ message: "Order placed successfully!", data: order });
    } catch (err) {
        console.error("Order creation error:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

const GetOrders = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.email });
        if (!user) return res.status(401).json({ message: "User profile not found" });

        const orders = await Order.find({ user_id: user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ message: "Orders retrieved", data: orders });
    } catch (err) {
        console.error("Get orders error:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

const CancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ email: req.email });
        if (!user) return res.status(401).json({ message: "User profile not found" });

        const order = await Order.findOne({ _id: id, user_id: user._id });
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status === "Out for Delivery" || order.status === "Delivered" || order.status === "Cancelled") {
            return res.status(400).json({ message: `Order cannot be cancelled because it is already '${order.status}'.` });
        }

        order.status = "Cancelled";
        await order.save();

        // Send cancellation email in background asynchronously
        sendCancelEmail(order).then(mailRes => {
            console.log("Cancellation email status:", mailRes);
        }).catch(err => {
            console.error("Async cancel email failed:", err);
        });

        return res.status(200).json({ message: "Order cancelled successfully", data: order });
    } catch (err) {
        console.error("Cancel order error:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

const UpdateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { items } = req.body;

        const user = await User.findOne({ email: req.email });
        if (!user) return res.status(401).json({ message: "User profile not found" });

        const order = await Order.findOne({ _id: id, user_id: user._id });
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status !== "Placed") {
            return res.status(400).json({ message: "Order can only be updated if its status is 'Placed'." });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Updated order items are required." });
        }

        // Recalculate totalAmount
        let total = 0;
        for (const item of items) {
            total += Number(item.price) * Number(item.quantity);
        }

        order.items = items;
        order.totalAmount = total;
        await order.save();

        // Send order update email in background asynchronously
        sendUpdateEmail(order).then(mailRes => {
            console.log("Order update email status:", mailRes);
        }).catch(err => {
            console.error("Async order update email failed:", err);
        });

        return res.status(200).json({ message: "Order updated successfully", data: order });
    } catch (err) {
        console.error("Update order error:", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

module.exports = {
    CreateOrder,
    GetOrders,
    CancelOrder,
    UpdateOrder
};
