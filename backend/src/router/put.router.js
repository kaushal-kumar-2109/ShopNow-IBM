const express = require("express");
const { UpdateUserPassword } = require("../handler/user.handler");

const router = express.Router();

router.route("/update-password").post(UpdateUserPassword);

module.exports = router;