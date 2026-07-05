const express = require("express");
const { GetUserData } = require("../handler/user.handler");
const { CheckUserAuth } = require("../middleware/checkAuth");
const { GetLanProduct, GetProductById, GetProductComments } = require("../handler/product.handler");
const { GetCart, GetWishlist } = require("../handler/cartWishlist.handler");
const { GetAddresses } = require("../handler/address.handler");
const { GetOrders } = require("../handler/order.handler");

const router = express.Router();


router.route("/get-user").get(CheckUserAuth, GetUserData);
router.route("/get-latest-product").get(GetLanProduct);
router.route("/get-product/:id").get(GetProductById);
router.route("/get-product-comments/:id").get(GetProductComments);
router.route("/get-cart").get(CheckUserAuth, GetCart);
router.route("/get-wishlist").get(CheckUserAuth, GetWishlist);
router.route("/get-address").get(CheckUserAuth, GetAddresses);
router.route("/get-orders").get(CheckUserAuth, GetOrders);

module.exports = router;