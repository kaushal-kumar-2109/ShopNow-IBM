const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
    reciver: {
        type: String,
        require: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    addressLine1: {
        type: String,
        required: true,
        unique: true
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
module.exports = Address;