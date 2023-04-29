var express = require("express");
var router = express.Router();
const userController = require("../controllers/user");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");
router.post("/sign-up", handleErrorAsync(userController.signUp));
router.post("/login", isAuth, handleErrorAsync(userController.login));

module.exports = router;
