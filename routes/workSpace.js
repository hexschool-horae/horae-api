var express = require("express");
var router = express.Router();
const workSpaceController = require("../controllers/workSpace");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");

router.post("/", isAuth, handleErrorAsync(workSpaceController.addWorkSpace));
router.get("/", isAuth, handleErrorAsync(workSpaceController.getWorkSpaces));
router.get(
  "/:wID",
  isAuth,
  handleErrorAsync(workSpaceController.getOneWorkSpace)
);
router.delete(
  "/:wID",
  isAuth,
  handleErrorAsync(workSpaceController.deleteOneWorkSpace)
);
router.patch(
  "/:wID",
  isAuth,
  handleErrorAsync(workSpaceController.updateOneWorkSpace)
);
//工作區成員相關
router.get(
  "/:wID/members",
  isAuth,
  handleErrorAsync(workSpaceController.getWorkSpaceMembers)
);

router.post(
  "/:wID/members/:hashData",
  isAuth,
  handleErrorAsync(workSpaceController.addWorkSpaceMembers)
);
router.patch(
  "/:wID/members",
  isAuth,
  handleErrorAsync(workSpaceController.updateWorkSpaceMembers)
);
module.exports = router;
