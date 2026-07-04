const express = require("express");
const { CreateUser, SetUser, SendOtp } = require("../handler/user.handler");

const router = express.Router();

router.route("/send-otp").post(SendOtp);
router.route("/create-user").post(CreateUser);
router.route("/set-user").post(SetUser);

module.exports = router;