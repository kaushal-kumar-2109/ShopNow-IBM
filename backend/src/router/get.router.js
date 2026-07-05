const express = require("express");
const { GetUserData } = require("../handler/user.handler");
const { CheckUserAuth } = require("../middleware/checkAuth");
const { GetLanProduct, GetProductById, GetProductComments } = require("../handler/product.handler");

const router = express.Router();


router.route("/get-user").get(CheckUserAuth, GetUserData);
router.route("/get-latest-product").get(GetLanProduct);
router.route("/get-product/:id").get(GetProductById);
router.route("/get-product-comments/:id").get(GetProductComments);

module.exports = router;