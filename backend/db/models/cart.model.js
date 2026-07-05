const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                size: {
                    type: String,
                    default: "OS",
                },
                color: {
                    type: String,
                    default: "",
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                    min: 1,
                },
            },
        ],
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
