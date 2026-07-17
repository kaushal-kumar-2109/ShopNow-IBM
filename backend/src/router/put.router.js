// ------------------------- requiring package -------------------------
const express = require("express");

// ------------------------- requiring other files -------------------------
const { UpdateUserPassword, LogoutUser } = require("../handler/user.handler");
const { CheckUserAuth, CheckDeviceAuth } = require("../middleware/checkAuth");
const { UpdateProfile } = require("../handler/user.handler");
const { UpdateCartQuantity } = require("../handler/cartWishlist.handler");
const { UpdateAddress } = require("../handler/address.handler");
const { UpdateOrder } = require("../handler/order.handler");
const { AddAddress, DeleteAddress } = require("../handler/address.handler");
const { DeleteDevice } = require("../handler/device.handler");

// ------------------------- express router variables -------------------------
const router = express.Router();

// ------------------------- update and delete routers -------------------------
router.route("/update-password").post(CheckDeviceAuth, UpdateUserPassword); // --- update the password
router.route("/update-cart-quantity").post(CheckUserAuth, UpdateCartQuantity); // --- update cart product quantity
router.route("/update-profile").post(CheckUserAuth, UpdateProfile); // --- update user profile
router.route("/update-address/:id").post(CheckUserAuth, UpdateAddress); // --- update the address
router.route("/update-order/:id").post(CheckUserAuth, UpdateOrder); // --- update the order
router.route("/delete-device").post(CheckUserAuth, DeleteDevice); // --- logout from other device
router.route("/delete-address/:id").post(CheckUserAuth, DeleteAddress); // --- delete the user address 
router.route("/logot-user").post(LogoutUser); // --- delete the user token

module.exports = router;