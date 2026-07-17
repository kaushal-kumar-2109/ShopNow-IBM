// ------------------------- requiring package -------------------------
const express = require("express");

// ------------------------- requiring other files -------------------------
const { GetUserData } = require("../handler/user.handler");
const { CheckUserAuth } = require("../middleware/checkAuth");
const { GetLanProduct, GetProductById, GetProductComments } = require("../handler/product.handler");
const { GetCart, GetWishlist } = require("../handler/cartWishlist.handler");
const { GetAddresses } = require("../handler/address.handler");
const { GetOrders } = require("../handler/order.handler");
const { GetDevice } = require("../handler/device.handler");

// ------------------------- express router variables -------------------------
const router = express.Router();

// ------------------------- get routers -------------------------
router.route("/get-user").get(CheckUserAuth, GetUserData); // --- for get user data
router.route("/get-latest-product").get(GetLanProduct); // --- for the top 10 latest product
router.route("/get-product/:id").get(GetProductById); // --- for get product by id
router.route("/get-product-comments/:id").get(GetProductComments); // --- for get the comments of specific product
router.route("/get-cart").get(CheckUserAuth, GetCart); // --- get cart data
router.route("/get-wishlist").get(CheckUserAuth, GetWishlist); // --- get wishlist data
router.route("/get-address").get(CheckUserAuth, GetAddresses); // --- get all address of user
router.route("/get-orders").get(CheckUserAuth, GetOrders); // --- order placed by the user
router.route("/get-device").get(CheckUserAuth, GetDevice); // --- all device where user is logged in

module.exports = router;