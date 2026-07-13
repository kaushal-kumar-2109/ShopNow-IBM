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
        const { deviceToken, jwtoken } = req.cookies;
        const { deviceRes, email } = req.body;

        const resolutionString = Array.isArray(deviceRes.screenResolution)
            ? deviceRes.screenResolution.join('x')
            : (deviceRes.screenResolution || "unknown");

        const userDataRes = await User.findOne({ email });
        if (!userDataRes) {
            return res.status(404).json({ tag: "user", message: "User not found!, Please enter correct email" });
        }

        if (!deviceToken || deviceToken === undefined || deviceToken === null || deviceToken === "undefined" || deviceToken === "null" || deviceToken === "") {
            const deviceDataRes = await Device.find({ userId: userDataRes._id });
            let isDeviceMatch = false;

            if (deviceDataRes || deviceDataRes.length > 0) {
                deviceDataRes.forEach(dData => {
                    let counter = 0;

                    if (dData.architecture != deviceRes.architecture) counter++;
                    if (dData.hardwareConcurrency != deviceRes.hardwareConcurrency) counter++;
                    if (dData.deviceMemory != deviceRes.deviceMemory) counter++;
                    if (dData.screenResolution != resolutionString) counter++;
                    if (dData.timezone != deviceRes.timezone) counter++;
                    if (dData.platform != deviceRes.platform) counter++;

                    if (counter <= 2) {
                        isDeviceMatch = true;
                    }
                });
            }

            if (!isDeviceMatch || isDeviceMatch == false || deviceDataRes.length <= 0 || !deviceDataRes) {
                SendOTP(email || null);
            }

            const deviceTokenRes = await CreateDeviceToken(deviceRes);
            const isLocal = process.env.WEB == "local";

            res.cookie("deviceToken", deviceTokenRes.token, {
                httpOnly: true,
                secure: !isLocal,
                sameSite: isLocal ? "lax" : "none",
            });
            await Device.create({
                userId: userDataRes._id,
                architecture: deviceRes.architecture || "unknown",
                hardwareConcurrency: deviceRes.hardwareConcurrency || 0,
                deviceMemory: deviceRes.deviceMemory || 0,
                screenResolution: resolutionString,
                timezone: deviceRes.timezone || "unknown",
                platform: deviceRes.platform || "unknown",
                deviceToken: deviceTokenRes.token,
                deviceUserToken: jwtoken
            });
            return next();
        }

        return next();

    } catch (err) {
        console.log("server error => ", err);
        return res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}

module.exports = { CheckUserAuth, CheckDeviceAuth };