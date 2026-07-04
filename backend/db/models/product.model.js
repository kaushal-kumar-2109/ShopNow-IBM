const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        user_name: {
            type: String,
            default: "ShopNow"
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        description: {
            type: String,
            required: true,
        },

        shortDescription: {
            type: String,
            maxlength: 300,
        },

        brand: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        subCategory: {
            type: String,
        },

        images: [
            {
                url: String,
                alt: String,
            },
        ],

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        discountPrice: {
            type: Number,
            default: null,
        },

        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },

        sold: {
            type: Number,
            default: 0,
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        totalReviews: {
            type: Number,
            default: 0,
        },

        colors: [String],

        sizes: [String],

        tags: [String],

        isFeatured: {
            type: Boolean,
            default: false,
        },
        status: {
            type: Boolean,
            default: true
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
    }
);


const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;