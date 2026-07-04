const bcrypt = require("bcrypt");

const User = require("../../db/models/user.model.js");
const Otp = require("../../db/models/otp.model.js");
const Token = require("../../db/models/token.model.js");
const SendOTP = require("../utils/sendOtp.js");
const CreateUserToken = require("../utils/createToken.js");

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
        const { name, email, password, otp } = req.body;

        if (!name) return res.status(400).json({ tag: "name", message: "Name is required" });
        if (!email) return res.status(400).json({ tag: "email", message: "Email is required" });
        if (!password) return res.status(400).json({ tag: "password", message: "Password is required" });
        if (!otp) return res.status(400).json({ tag: "otp", message: "Otp required" });

        const existUser = await User.findOne({ email });
        if (existUser) return res.status(400).json({ tag: "email", message: "User already exists" });

        const otpData = await Otp.findOne({ email });
        if (!otpData) return res.status(400).json({ tag: "otp", message: "OTP is not valid" });
        if (otpData.expires_at <= Date.now()) return res.status(400).json({ tag: "otp", message: "OTP is expired" });
        if (parseInt(otpData.otp) !== parseInt(otp)) return res.status(400).json({ tag: "otp", message: "OTP is not valid" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });
        await Otp.deleteOne({ email });

        const response = await CreateUserToken(name, email, "USER");
        if (response.status) {
            // res.clearCookie('token');
            res.cookie("token", response.token, {
                httpOnly: true,
                secure: (process.env.WEB === "local") ? false : true,
                sameSite: (process.env.WEB === "local") ? "lax" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            const oldToken = await Token.findOne({ email });
            if (oldToken) await Token.deleteOne({ email });
            await Token.create({
                token: response.token,
                email: email
            });
            return res.status(201).json({ message: "User created successfully", token: response.token });
        } else {
            return res.status(401).json({ tag: "token", message: "Token is not created" });
        }
    } catch (err) {
        console.log("There is an server error => ", err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
}

const SetUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) return res.status(400).json({ tag: "email", message: "Email is required" });
        if (!password) return res.status(400).json({ tag: "password", message: "Password is required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ tag: "email", message: "User not found" });

        const isValide = bcrypt.compare(password, user.password);
        if (!isValide) return res.status(400).json({ tag: "password", message: "Password is not valid" });

        const response = await CreateUserToken(user.name, user.email, "USER");
        if (response.status) {
            // res.clearCookie('token');
            res.cookie("token", response.token, {
                httpOnly: true,
                secure: (process.env.WEB === "local") ? false : true,
                sameSite: (process.env.WEB === "local") ? "lax" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            const oldToken = await Token.findOne({ email });
            if (oldToken) await Token.deleteOne({ email });

            await Token.create({
                token: response.token,
                email: email
            });
            return res.status(201).json({ message: "User login successfully", token: response.token });
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

module.exports = { SendOtp, CreateUser, SetUser, UpdateUserPassword, GetUserData };