// ------------------------- requiring package -------------------------
const express = require("express");

// ------------------------- requiring other files -------------------------
const { CheckUserAuth, CheckDeviceAuth } = require("../middleware/checkAuth");
const { CreateUser, SetUser, SendOtp } = require("../handler/user.handler");
const { PostComment } = require("../handler/product.handler");
const { AddToCart, RemoveFromCart, ClearCart, ToggleWishlist } = require("../handler/cartWishlist.handler");
const { AddAddress, DeleteAddress } = require("../handler/address.handler");
const { CreateOrder, CancelOrder } = require("../handler/order.handler");

// ------------------------- express router variables -------------------------
const router = express.Router();

// ------------------------- post routers -------------------------
router.route("/send-otp").post(SendOtp); // --- send otp for email verification
router.route("/create-user").post(CreateUser); // --- user signup page 
router.route("/set-user").post(CheckDeviceAuth, SetUser); // --- for user login
router.route("/post-comment").post(CheckUserAuth, PostComment); // --- for add comment on the product
router.route("/add-to-cart").post(CheckUserAuth, AddToCart); // --- add product in the user cart
router.route("/remove-from-cart").post(CheckUserAuth, RemoveFromCart); // --- remove product from user cart
router.route("/clear-cart").post(CheckUserAuth, ClearCart); // --- remove all the product from user cart
router.route("/toggle-wishlist").post(CheckUserAuth, ToggleWishlist); // -- for toggel the user wishlist
router.route("/add-address").post(CheckUserAuth, AddAddress); // --- add addresss for the user 
router.route("/place-order").post(CheckUserAuth, CreateOrder); // --- create order 
router.route("/cancel-order/:id").post(CheckUserAuth, CancelOrder); // --- for cancel the order 

module.exports = router;