const Device = require("../../db/models/device.model.js");
const Token = require("../../db/models/token.model.js");
const User = require("../../db/models/user.model.js");

const GetDevice = async (req, res) => {
    try {
        const userData = await User.findOne({ email: req.email });
        if (!userData) return res.status(404).json({ tag: "user", message: "User not found!" });

        const deviceData = await Device.find({ userId: userData._id });
        if (!deviceData) return res.status(404).json({ tag: "device", message: "Device not found!" });

        return res.status(200).json({ tag: "success", message: "Device found!", data: deviceData });
    } catch (err) {
        console.error("There is a server error => ", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const DeleteDevice = async (req, res) => {
    try {
        const { deviceId } = req.body;

        const userData = await User.findOne({ email: req.email });
        if (!userData) return res.status(404).json({ tag: "user", message: "User not found!" });

        const checkDevice = await Device.findOne({ _id: deviceId });
        if (!checkDevice) return res.status(404).json({ tag: "device", message: "Device not found!" });

        await Token.deleteOne({ token: checkDevice.deviceUserToken });
        await Device.deleteOne({ _id: deviceId });
        return res.status(200).json({ tag: "success", message: "Device deleted successfully!" });
    } catch (err) {
        console.error("There is a server error => ", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { GetDevice, DeleteDevice };