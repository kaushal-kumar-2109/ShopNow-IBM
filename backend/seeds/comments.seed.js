require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../db/models/user.model.js");
const Product = require("../db/models/product.model.js");
const Comment = require("../db/models/comments.model.js");

const MONGO_URI = process.env.MONGO_DB_URL || process.env.MONGO_DB_SRV_URL;

const comments = [
    "Excellent quality product.",
    "Highly recommended!",
    "Worth every penny.",
    "Amazing build quality.",
    "Looks exactly like the pictures.",
    "Very comfortable to use.",
    "Fast delivery and good packaging.",
    "Satisfied with the purchase.",
    "Would definitely buy again.",
    "Premium quality.",
    "The material feels great.",
    "Nice design and finish.",
    "Perfect fitting.",
    "The color is beautiful.",
    "Exceeded my expectations.",
    "Very stylish product.",
    "Quality could be better.",
    "Not bad for the price.",
    "Five stars from me.",
    "Exactly what I wanted.",
    "Loved it!",
    "Works perfectly.",
    "Easy to use.",
    "Fantastic product.",
    "Value for money.",
    "Good packaging.",
    "Very durable.",
    "The size fits perfectly.",
    "Comfortable and lightweight.",
    "I am impressed.",
    "Looks premium.",
    "One of my favorite purchases.",
    "Delivery was quick.",
    "Good customer service.",
    "Will recommend to friends.",
    "Nice finishing.",
    "Elegant design.",
    "Perfect gift.",
    "Affordable and reliable.",
    "Quality is top-notch."
];

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seedComments() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("✅ Database Connected");

        // Remove old comments
        await Comment.deleteMany({});
        console.log("🗑️ Old comments deleted");

        const users = await User.find({}, "_id name");
        const products = await Product.find({}, "_id title");

        if (!users.length || !products.length) {
            throw new Error("Users or Products not found.");
        }

        const bulkComments = [];

        for (const product of products) {
            const totalComments = random(3, 8);

            // Prevent duplicate users commenting on the same product
            const usedUsers = new Set();

            for (let i = 0; i < totalComments; i++) {

                let user;

                do {
                    user = randomItem(users);
                } while (usedUsers.has(user._id.toString()));

                usedUsers.add(user._id.toString());

                bulkComments.push({
                    user_id: user._id,
                    user_name: user.name,
                    product_id: product._id,
                    product_name: product.title,
                    comment: randomItem(comments),
                    status: Math.random() > 0.05, // 95% active
                    created_at: new Date(),
                    updated_at: new Date()
                });
            }
        }

        console.log(`Preparing ${bulkComments.length} comments...`);

        // Insert in batches
        const batchSize = 1000;

        for (let i = 0; i < bulkComments.length; i += batchSize) {
            const batch = bulkComments.slice(i, i + batchSize);
            await Comment.insertMany(batch);

            console.log(
                `Inserted ${Math.min(i + batchSize, bulkComments.length)} / ${bulkComments.length}`
            );
        }

        console.log(`🎉 Successfully inserted ${bulkComments.length} comments`);

        mongoose.connection.close();

    } catch (err) {
        console.error(err);
        mongoose.connection.close();
    }
}

seedComments();