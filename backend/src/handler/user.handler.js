const bcrypt = require("bcrypt");

const User = require("../../db/models/user.model.js");
const Otp = require("../../db/models/otp.model.js");
const Token = require("../../db/models/token.model.js");
const SendOTP = require("../utils/sendOtp.js");
const { CreateUserToken, CreateDeviceToken } = require("../utils/createToken.js");
const Device = require("../../db/models/device.model.js");

const SendOtp = async (req, res) => {
    try {
        const { email, tag } = req.body;
        if (!email) return res.status(400).json({ tag: "email", message: "Email is required" });

        const userData = await User.findOne({ email });
        if (tag === "signup" || tag === "recover") {
            if (tag === "signup" && userData) return res.status(400).json({ tag: "email", message: "User already exists" });
            if (tag === "recover" && !userData) return res.status(400).json({ tag: "email", message: "User not found" });
        } else {
            return res.status(400).json({ tag: "tag", message: "Invalid request..." });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpData = await Otp.findOne({ email });
        if (otpData) await Otp.deleteOne({ email });

        await Otp.create({ otp, email });
        const response = await SendOTP(email, otp, tag);
        if (response.status === true) return res.status(200).json({ message: "OTP sent successfully" });
        return res.status(500).json({ message: "Failed to send OTP", error: response.info });
    } catch (err) {
        console.log("There is an server error => ", err);
        return res.status(500).json({ message: "Internal server error", error: err })
    }
}

const CreateUser = async (req, res) => {
    try {
        const { name, email, password, otp, deviceRes } = req.body;

        // 1. Core Input Validation
        if (!name) return res.status(400).json({ tag: "name", message: "Name is required" });
        if (!email) return res.status(400).json({ tag: "email", message: "Email is required" });
        if (!password) return res.status(400).json({ tag: "password", message: "Password is required" });
        if (!otp) return res.status(400).json({ tag: "otp", message: "Otp required" });

        // 2. Existing User Verification
        const existUser = await User.findOne({ email });
        if (existUser) return res.status(400).json({ tag: "email", message: "User already exists" });

        // 3. OTP Verification Validation
        const otpData = await Otp.findOne({ email });
        if (!otpData) return res.status(400).json({ tag: "otp", message: "OTP is not valid" });
        if (otpData.expires_at <= Date.now()) return res.status(400).json({ tag: "otp", message: "OTP is expired" });
        if (parseInt(otpData.otp) !== parseInt(otp)) return res.status(400).json({ tag: "otp", message: "OTP is not valid" });

        // 4. User Generation
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await Otp.deleteOne({ email });
        await newUser.save();

        // 5. Safe Extraction of Device Variables (Prevents Server Crashes if missing)
        const deviceData = deviceRes || {};
        const resolutionString = Array.isArray(deviceData.screenResolution)
            ? deviceData.screenResolution.join('x')
            : (deviceData.screenResolution || "unknown");

        // 6. Token Generation
        const deviceToken = await CreateDeviceToken(deviceRes);
        const response = await CreateUserToken(newUser._id,name, email, "USER");

        if (response.status) {
            const isLocal = process.env.WEB === "local";

            // 7. Secure Cookie Storage Setup
            res.cookie("jwtoken", response.token, {
                httpOnly: true,
                secure: !isLocal,
                sameSite: isLocal ? "lax" : "none",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.cookie("deviceToken", deviceToken.token, {
                httpOnly: true,
                secure: !isLocal,
                sameSite: isLocal ? "lax" : "none",
            });

            // 8. Clean up Old User Authorization Tokens
            await Token.deleteOne({ email });
            await Token.create({ token: response.token, email: email });

            // 10. Persist Safe Fingerprint Record
            await Device.create({
                userId: newUser._id,
                architecture: deviceData.architecture || "unknown",
                hardwareConcurrency: deviceData.hardwareConcurrency || 0,
                deviceMemory: deviceData.deviceMemory || 0,
                screenResolution: resolutionString,
                timezone: deviceData.timezone || "unknown",
                platform: deviceData.platform || "unknown",
                deviceToken: deviceToken.token,
                deviceUserToken: response.token
            });

            return res.status(201).json({ message: "User created successfully", token: response.token });
        } else {
            return res.status(401).json({ tag: "token", message: "Token is not created" });
        }
    } catch (err) {
        console.error("There is a server error => ", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


const SetUser = async (req, res) => {
    try {

        const { email, password, deviceRes } = req.body;

        const resolutionString = Array.isArray(deviceRes.screenResolution)
            ? deviceRes.screenResolution.join('x')
            : (deviceRes.screenResolution || "unknown");

        if (!email) return res.status(400).json({ tag: "email", message: "Email is required" });
        if (!password) return res.status(400).json({ tag: "password", message: "Password is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ tag: "email", message: "User not found" });

        const isValide = await bcrypt.compare(password, user.password);
        if (!isValide) return res.status(400).json({ tag: "password", message: "Password is not valid" });

        const response = await CreateUserToken(user.name, user.email, "USER");
        const deviceTokenRes = await CreateDeviceToken(deviceRes);
        if (response.status) {
            // res.clearCookie('token');
            res.cookie("jwtoken", response.token, {
                httpOnly: true,
                secure: (process.env.WEB === "local") ? false : true,
                sameSite: (process.env.WEB === "local") ? "lax" : "none",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.cookie("deviceToken", deviceTokenRes.token, {
                httpOnly: true,
                secure: (process.env.WEB === "local") ? false : true,
                sameSite: (process.env.WEB === "local") ? "lax" : "none",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            // const oldToken = await Token.findOne({ email });
            // if (oldToken) await Token.deleteOne({ email });

            await Token.create({token: response.token,email: email});
            await Device.create({
                userId: user._id,
                architecture: deviceRes.architecture || "unknown",
                hardwareConcurrency: deviceRes.hardwareConcurrency || 0,
                deviceMemory: deviceRes.deviceMemory || 0,
                screenResolution: resolutionString,
                timezone: deviceRes.timezone || "unknown",
                platform: deviceRes.platform || "unknown",
                deviceToken: deviceTokenRes.token,
                deviceUserToken: response.token
            });
            // const deviceTokenJson = req.deviceTokenData;
            // if (deviceTokenJson && typeof deviceTokenJson === "object") {
            //     deviceTokenJson.deviceUserToken = response.token;
            //     await Device.create(deviceTokenJson);
            // }

            return res.status(201).json({ message: "User login successfully", token: response.token, name: user.name });
        } else {
            return res.status(401).json({ tag: "token", message: "Token is not created" });
        }
    } catch (err) {
        console.log("There is an server error => ", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

const UpdateUserPassword = async (req, res) => {
    try {
        const { email, password, otp, } = req.body;

        if (!email) return res.status(400).json({ tag: "email", message: "Email is required" });
        if (!password) return res.status(400).json({ tag: "password", message: "Password is required" });
        if (!otp) return res.status(400).json({ tag: "otp", message: "OTP is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ tag: "email", message: "User not found" });

        const otpData = await Otp.findOne({ email });
        if (!otpData) return res.status(400).json({ tag: "otp", message: "OTP is not valid" });
        if (otpData.expires_at <= Date.now()) return res.status(400).json({ tag: "otp", message: "OTP is expired" });
        if (parseInt(otpData.otp) !== parseInt(otp)) return res.status(400).json({ tag: "otp", message: "OTP is not valid" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.updateOne({ email }, { password: hashedPassword });
        await Otp.deleteOne({ email });
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.log("There is an server error => ", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

const GetUserData = async (req, res) => {
    try {
        const email = req.email;

        const userData = await User.findOne({ email });
        if (!userData) return res.status(400).json({ tag: "user", message: "User not found" });

        return res.status(200).json({ message: "User data fetched successfully", data: userData });
    } catch (err) {
        console.log("There is an server error => ", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

const UpdateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });

        const user = await User.findOneAndUpdate({ email: req.email }, { name }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ message: "Profile updated successfully", data: user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

const LogoutUser = async (req,res) => {
    try{
        const { jwtoken } = req.cookies;
        await Token.deleteOne({token:jwtoken});
        res.clearCookie("jwtoken", { 
            httpOnly: true, 
            secure: (process.env.WEB === "local") ? false : true,
            sameSite: (process.env.WEB === "local") ? "lax" : "none",
        });
        res.clearCookie("deviceToken", { 
            httpOnly: true, 
            secure: (process.env.WEB === "local") ? false : true,
            sameSite: (process.env.WEB === "local") ? "lax" : "none",
        });
        return res.status(200).json({message:"user logout!"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}
module.exports = { SendOtp, CreateUser, SetUser, UpdateUserPassword, GetUserData, UpdateProfile, LogoutUser };