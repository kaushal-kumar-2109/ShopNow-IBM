// ------------------------- requiring packages ------------------------- //
const mongoose = require('mongoose');

// ------------------------- mongodb url ------------------------- //
const mongoUrl = process.env.MONGO_DB_URL || process.env.MONGO_DB_SRV_URL

// ------------------------- connect to mongodb ------------------------- //
const connectToDb = async () => {
    try {
        await mongoose.connect(mongoUrl)
        console.log('Connected to MongoDB!');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};

// ------------------------- call the function ------------------------- //
connectToDb();
