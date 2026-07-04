const mongoose = require("mongoose");

const CommentsSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    user_name: {
        type: String,
        default: "ShopNow"
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    product_name: {
        type: String,
        default: "ShopNow"
    },
    comment: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model("Comment", CommentsSchema);

module.exports = Comment;