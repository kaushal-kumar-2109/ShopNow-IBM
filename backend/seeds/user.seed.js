require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../db/models/user.model.js");

const MONGO_URI = process.env.MONGO_DB_URL || process.env.MONGO_DB_SRV_URL;

const firstNames = [
    "Aarav", "Vivaan", "Aditya", "Arjun", "Krishna",
    "Rohan", "Rahul", "Karan", "Aman", "Raj",
    "Priya", "Ananya", "Sneha", "Neha", "Pooja",
    "Isha", "Diya", "Riya", "Meera", "Nisha", "Joy", "Roshan", "Vikash"
];

const lastNames = [
    "Sharma", "Verma", "Patel", "Singh", "Gupta",
    "Kumar", "Yadav", "Jain", "Agarwal", "Joshi", "Kanojiya", "Prajapati"
];

async function seedUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Database Connected");

        // Uncomment if you want to clear existing users
        await User.deleteMany({});
        console.log("🗑️ Existing users deleted");

        const hashedPassword = await bcrypt.hash("Password@123", 10);

        const users = [];

        for (let i = 1; i <= 400; i++) {
            const firstName =
                firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName =
                lastNames[Math.floor(Math.random() * lastNames.length)];

            users.push({
                name: `${firstName} ${lastName}`,
                email: `user${i}@example.com`,
                password: hashedPassword,
                role:
                    i <= 3
                        ? "ADMIN"
                        : i <= 140
                            ? "SELLER"
                            : "USER"
            });
        }

        await User.insertMany(users);

        console.log(`🎉 ${users.length} users inserted successfully!`);

        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error:", error);
        mongoose.connection.close();
    }
}

seedUsers();