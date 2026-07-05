const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
    reciver: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    addressType: {
        type: String,
        enum: ["HOME", "OFFICE", "OTHER"],
        default: "HOME"
    },
    googleLocation: {
        type: String,
        default: ""
    },
    default: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

const Address = mongoose.model("Address", AddressSchema);

// Drop unique index if it exists in the database
mongoose.connection.on('connected', () => {
    mongoose.connection.db.collection('addresses').dropIndex('addressLine1_1')
        .then(() => console.log('Successfully dropped addressLine1 unique index'))
        .catch(err => {
            // Index might not exist or already dropped
        });
});

// Also run immediately if database is already connected
if (mongoose.connection.readyState === 1) {
    mongoose.connection.db.collection('addresses').dropIndex('addressLine1_1').catch(() => {});
}

module.exports = Address;