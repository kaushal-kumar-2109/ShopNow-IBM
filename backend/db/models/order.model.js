const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    email: {
        type: String,
        required: true
    },
    items: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        size: {
            type: String,
            default: ""
        },
        color: {
            type: String,
            default: ""
        }
    }],
    billingAddress: {
        reciver: { type: String, required: true },
        addressLine1: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pincode: { type: String, required: true },
        phone: { type: String, required: true }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "paypal", "card"],
        default: "cod"
    },
    status: {
        type: String,
        enum: ["Placed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
        default: "Placed"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
