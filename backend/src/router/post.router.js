const express = require("express");
const { CheckUserAuth } = require("../middleware/checkAuth");
const { CreateUser, SetUser, SendOtp } = require("../handler/user.handler");
const { PostComment } = require("../handler/product.handler");

const router = express.Router();

router.route("/send-otp").post(SendOtp);
router.route("/create-user").post(CreateUser);
router.route("/set-user").post(SetUser);
router.route("/post-comment").post(CheckUserAuth, PostComment);

module.exports = router;