const express = require("express");
const { GetUserData } = require("../handler/user.handler");
const { CheckUserAuth } = require("../middleware/checkAuth");

const router = express.Router();


router.route("/get-user").get(CheckUserAuth, GetUserData);

module.exports = router;