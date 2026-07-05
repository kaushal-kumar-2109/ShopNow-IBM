const express = require("express");
const { CheckUserAuth } = require("../middleware/checkAuth");
const { CreateUser, SetUser, SendOtp } = require("../handler/user.handler");
const { PostComment } = require("../handler/product.handler");
const { AddToCart, UpdateCartQuantity, RemoveFromCart, ClearCart, ToggleWishlist } = require("../handler/cartWishlist.handler");

const router = express.Router();

router.route("/send-otp").post(SendOtp);
router.route("/create-user").post(CreateUser);
router.route("/set-user").post(SetUser);
router.route("/post-comment").post(CheckUserAuth, PostComment);
router.route("/add-to-cart").post(CheckUserAuth, AddToCart);
router.route("/update-cart-quantity").post(CheckUserAuth, UpdateCartQuantity);
router.route("/remove-from-cart").post(CheckUserAuth, RemoveFromCart);
router.route("/clear-cart").post(CheckUserAuth, ClearCart);
router.route("/toggle-wishlist").post(CheckUserAuth, ToggleWishlist);

module.exports = router;