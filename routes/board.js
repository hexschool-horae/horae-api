var express = require("express");
var router = express.Router();
const boardController = require("../controllers/board");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth, isAuthBoard } = require("../service/auth");

router.post("/", isAuth, handleErrorAsync(boardController.addBoard));
router.get("/:bID", handleErrorAsync(boardController.getOneBoard));
router.post(
  "/:bID/list",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.addlist)
);

//標籤相關-----------------------------------------------------------------------------
router.get(
  "/:bID/tags",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.getTags)
);
router.post(
  "/:bID/tags",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.addTag)
);
router.put(
  "/:bID/tags",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.updateTag)
);
router.delete(
  "/:bID/tags",
  isAuth,
  isAuthBoard,
  handleErrorAsync(boardController.deleteTag)
);

module.exports = router;
