const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        ],
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
module.exports = Wishlist;
