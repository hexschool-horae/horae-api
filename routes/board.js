var express = require("express");
var router = express.Router();
const boardController = require("../controllers/board");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");

router.post("/", isAuth, handleErrorAsync(boardController.addBoard));
router.get("/", isAuth, handleErrorAsync(boardController.getBoards));

module.exports = router;
