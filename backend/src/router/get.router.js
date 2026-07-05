const express = require("express");
const { GetUserData } = require("../handler/user.handler");
const { CheckUserAuth } = require("../middleware/checkAuth");
const { GetLanProduct } = require("../handler/product.handler");

const router = express.Router();


router.route("/get-user").get(CheckUserAuth, GetUserData);
router.route("/get-latest-product").get(GetLanProduct);

module.exports = router;