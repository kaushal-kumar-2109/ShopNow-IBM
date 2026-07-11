const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    architecture: {
        type: String,
        require: true
    },
    hardwareConcurrency: {
        type: Number,
        require: true
    },
    deviceMemory: {
        type: String,
        require: true
    },
    screenResolution: {},
    timezone: {
        type: String,
        require: true
    },
    platform: {
        type: String,
        require: true
    },
    deviceToken: {
        type: String,
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
});

const Device = mongoose.model("Devices", deviceSchema);

module.exports = Device;