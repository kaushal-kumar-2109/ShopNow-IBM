require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const nProduct = 5000;
const Product = require("../db/models/product.model.js");
const User = require("../db/models/user.model.js");

const MONGO_URI = process.env.MONGO_DB_URL || process.env.MONGO_DB_SRV_URL;

const brands = [
    "Nike",
    "Adidas",
    "Puma",
    "Levis",
    "Zara",
    "H&M",
    "Roadster",
    "Allen Solly",
    "Louis Philippe",
    "Peter England",
    "Woodland",
    "US Polo",
    "Tommy Hilfiger",
    "Gucci",
    "Prada",
    "Apple",
    "Samsung",
    "Sony",
    "Boat",
    "JBL"
];

const colors = [
    "Black",
    "White",
    "Blue",
    "Red",
    "Green",
    "Yellow",
    "Pink",
    "Grey",
    "Brown"
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const subCategories = {
    mens: ["Shirt", "T-Shirt", "Jeans", "Jacket"],
    womens: ["Dress", "Top", "Jeans", "Kurti"],
    electronics: ["Phone", "Laptop", "Headphone"],
    jewelery: ["Ring", "Bracelet", "Necklace"]
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("Database Connected");

        await Product.deleteMany({});
        console.log("🗑️ Existing products deleted");

        const users = await User.find();

        const response = await axios.get("https://fakestoreapi.com/products");

        const fakeProducts = response.data;

        const products = [];

        for (let i = 0; i < nProduct; i++) {

            const p = fakeProducts[i % fakeProducts.length];

            const seller = randomArray(users);

            const price = random(500, 12000);

            const discount = random(5, 40);

            products.push({

                user_id: seller._id,

                user_name: seller.name,

                title: `${p.title} ${i + 1}`,

                description: p.description,

                shortDescription: p.description.substring(0, 120),

                brand: randomArray(brands),

                category: p.category,

                subCategory:
                    subCategories[p.category]
                        ? randomArray(subCategories[p.category])
                        : "General",

                images: [
                    {
                        url: p.image,
                        alt: p.title
                    },
                    {
                        url: p.image,
                        alt: p.title + " Front"
                    },
                    {
                        url: p.image,
                        alt: p.title + " Side"
                    }
                ],

                price,

                discountPrice:
                    Math.floor(price - (price * discount) / 100),

                stock: random(10, 300),

                sold: random(0, 500),

                rating: Number((Math.random() * 5).toFixed(1)),

                totalReviews: random(0, 2000),

                colors: colors.sort(() => 0.5 - Math.random()).slice(0, random(2, 5)),

                sizes: sizes.slice(0, random(2, 6)),

                tags: [
                    randomArray(colors),
                    randomArray(brands),
                    p.category
                ],

                isFeatured: Math.random() < 0.1,

                status: true,

                isPublished: true,

                created_at: new Date(),

                updated_at: new Date()
            });

        }

        await Product.insertMany(products);

        console.log(`🎉 ${nProduct} Products Created`);

        process.exit();

    } catch (err) {

        console.log(err);

        process.exit();

    }
}

seed();