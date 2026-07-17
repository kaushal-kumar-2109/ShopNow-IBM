const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },

    token: {
        type: String,
        required: true
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    expires_at: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
});

// TTL Index - Deletes document when expires_at is reached
TokenSchema.index(
    { expires_at: 1 },
    { expireAfterSeconds: 0 }
);

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;