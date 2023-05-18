var express = require("express");
var router = express.Router();
const listController = require("../controllers/list");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");

router.post("/:lID/card", isAuth, handleErrorAsync(listController.addCard)); //B05-1 新增列表中卡片
module.exports = router;
