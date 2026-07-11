const express = require("express");
const { CheckUserAuth, CheckDeviceAuth } = require("../middleware/checkAuth");
const { CreateUser, SetUser, SendOtp } = require("../handler/user.handler");
const { PostComment } = require("../handler/product.handler");
const { AddToCart, RemoveFromCart, ClearCart, ToggleWishlist } = require("../handler/cartWishlist.handler");
const { AddAddress, DeleteAddress } = require("../handler/address.handler");
const { CreateOrder, CancelOrder } = require("../handler/order.handler");

const router = express.Router();

router.route("/send-otp").post(SendOtp);
router.route("/create-user").post(CreateUser);
router.route("/set-user").post(CheckDeviceAuth, SetUser);
router.route("/post-comment").post(CheckUserAuth, PostComment);
router.route("/add-to-cart").post(CheckUserAuth, AddToCart);
router.route("/remove-from-cart").post(CheckUserAuth, RemoveFromCart);
router.route("/clear-cart").post(CheckUserAuth, ClearCart);
router.route("/toggle-wishlist").post(CheckUserAuth, ToggleWishlist);
router.route("/add-address").post(CheckUserAuth, AddAddress);
router.route("/delete-address/:id").post(CheckUserAuth, DeleteAddress);
router.route("/place-order").post(CheckUserAuth, CreateOrder);
router.route("/cancel-order/:id").post(CheckUserAuth, CancelOrder);

module.exports = router;