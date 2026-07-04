const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    expires_at: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    }
});

// TTL Index
OtpSchema.index(
    { expires_at: 1 },
    { expireAfterSeconds: 0 }
);

const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;