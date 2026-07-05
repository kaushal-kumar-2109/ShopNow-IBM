const express = require("express");
const { CheckUserAuth } = require("../middleware/checkAuth");
const { CreateUser, SetUser, SendOtp, UpdateProfile } = require("../handler/user.handler");
const { PostComment } = require("../handler/product.handler");
const { AddToCart, UpdateCartQuantity, RemoveFromCart, ClearCart, ToggleWishlist } = require("../handler/cartWishlist.handler");
const { AddAddress, UpdateAddress, DeleteAddress } = require("../handler/address.handler");
const { CreateOrder, CancelOrder, UpdateOrder } = require("../handler/order.handler");

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
router.route("/update-profile").post(CheckUserAuth, UpdateProfile);
router.route("/add-address").post(CheckUserAuth, AddAddress);
router.route("/update-address/:id").post(CheckUserAuth, UpdateAddress);
router.route("/delete-address/:id").post(CheckUserAuth, DeleteAddress);
router.route("/place-order").post(CheckUserAuth, CreateOrder);
router.route("/cancel-order/:id").post(CheckUserAuth, CancelOrder);
router.route("/update-order/:id").post(CheckUserAuth, UpdateOrder);

module.exports = router;