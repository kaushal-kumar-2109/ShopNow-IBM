const Token = require("../../db/models/token.model.js");
const Device = require("../../db/models/device.model.js");
const User = require("../../db/models/user.model.js");
const SendOTP = require("../utils/sendOtp.js");
const { CreateDeviceToken } = require("../utils/createToken.js");

const CheckUserAuth = async (req, res, next) => {
    try {
        const { jwtoken } = req.cookies;
        if (!jwtoken) return res.status(401).json({ tag: "token", message: "User is not authenticated" });
        const tokenData = await Token.findOne({ token: jwtoken });
        if (!tokenData) return res.status(401).json({ tag: "token", message: "User is not authenticated" });
        if (tokenData.expires_at < Date.now()) return res.status(401).json({ tag: "token", message: "Token is expired" });

        req.email = tokenData.email;
        next();
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}

const CheckDeviceAuth = async (req, res, next) => {
    try {
        const { deviceToken } = req.cookies;
        const { deviceRes } = req.body;

        const resolutionString = Array.isArray(deviceRes.screenResolution)
            ? deviceRes.screenResolution.join('x')
            : (deviceRes.screenResolution || "unknown");

        if (!deviceToken) next();
        const deviceData = await Device.findOne({ deviceToken });
        if (!deviceData) next();
        console.log("this is the device data = >> ", deviceData)
        const userData = await User.findOne({ _id: deviceData.userId });

        let redFlag = 0;

        if (deviceRes.architecture != deviceData.architecture) redFlag++;
        if (deviceRes.hardwareConcurrency != deviceData.hardwareConcurrency) redFlag++;
        if (deviceRes.deviceMemory != deviceData.deviceMemory) redFlag++;
        if (deviceRes.screenResolution != resolutionString) redFlag++;
        if (deviceRes.timezone != deviceData.timezone) redFlag++;
        if (deviceRes.platform != deviceData.platform) redFlag++;

        console.log("redflag => ", redFlag);
        if (redFlag >= 4) {
            SendOTP(email = userData.email || null);
            const deviceTokenRes = await CreateDeviceToken(deviceRes);
            res.cookie("deviceToken", deviceTokenRes.token, {
                httpOnly: true,
                secure: !isLocal,
                sameSite: isLocal ? "lax" : "none",
            });
            await Device.create({
                userId: userData._id,
                architecture: deviceData.architecture || "unknown",
                hardwareConcurrency: deviceData.hardwareConcurrency || 0,
                deviceMemory: deviceData.deviceMemory || 0,
                screenResolution: resolutionString,
                timezone: deviceData.timezone || "unknown",
                platform: deviceData.platform || "unknown",
                deviceToken: deviceTokenRes.token
            });
        }
        next();
    } catch (err) {
        console.log("server error => ", err);
        return res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}

module.exports = { CheckUserAuth, CheckDeviceAuth };