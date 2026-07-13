const express = require("express");
const { UpdateUserPassword } = require("../handler/user.handler");
const { CheckUserAuth, CheckDeviceAuth } = require("../middleware/checkAuth");
const { UpdateProfile } = require("../handler/user.handler");
const { UpdateCartQuantity } = require("../handler/cartWishlist.handler");
const { UpdateAddress } = require("../handler/address.handler");
const { UpdateOrder } = require("../handler/order.handler");
const { DeleteDevice } = require("../handler/device.handler");

const router = express.Router();

router.route("/update-password").post(CheckDeviceAuth, UpdateUserPassword);
router.route("/update-cart-quantity").post(CheckUserAuth, UpdateCartQuantity);
router.route("/update-profile").post(CheckUserAuth, UpdateProfile);
router.route("/update-address/:id").post(CheckUserAuth, UpdateAddress);
router.route("/update-order/:id").post(CheckUserAuth, UpdateOrder);
router.route("/delete-device").post(CheckUserAuth, DeleteDevice);

module.exports = router;