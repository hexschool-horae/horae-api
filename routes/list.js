var express = require("express");
var router = express.Router();
const listController = require("../controllers/list");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");

router.post("/", isAuth, handleErrorAsync(listController.addlist));

module.exports = router;
