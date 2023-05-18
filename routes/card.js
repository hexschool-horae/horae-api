var express = require("express");
var router = express.Router();
const cardController = require("../controllers/card");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");

router.get("/", isAuth, handleErrorAsync(cardController.filterCard)); //卡片篩選
router.get("/:cardID", isAuth, handleErrorAsync(cardController.getOneCard)); //取得單一卡片

module.exports = router;
