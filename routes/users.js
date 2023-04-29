var express = require("express");
var router = express.Router();
const userController = require("../controllers/user");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");
router.post("/sign-up", handleErrorAsync(userController.signUp));
router.post("/login", handleErrorAsync(userController.login));
router.get("/profile", isAuth, handleErrorAsync(userController.getProfile));
router.patch(
  "/profile",
  isAuth,
  handleErrorAsync(userController.updateProfile)
);
router.put(
  "/reset-pwd",
  isAuth,
  handleErrorAsync(userController.updatePassword)
);

module.exports = router;
