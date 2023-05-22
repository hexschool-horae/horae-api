var express = require("express");
var router = express.Router();
const workSpaceController = require("../controllers/workSpace");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth, isAuthWorkspace } = require("../service/auth");

router.post("/", isAuth, handleErrorAsync(workSpaceController.addWorkSpace));
router.get("/", isAuth, handleErrorAsync(workSpaceController.getWorkSpaces));
router.get(
  "/:wID",
  isAuth,
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.getOneWorkSpace)
);
router.delete(
  "/:wID",
  isAuth,
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.deleteOneWorkSpace)
);
router.patch(
  "/:wID",
  isAuth,
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.updateOneWorkSpace)
);
router.post(
  "/:wID/invitation-link",
  isAuth,
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.invitationLink)
);
//工作區成員相關
router.get(
  "/:wID/members",
  isAuth,
  isAuthWorkspace,
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
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.updateWorkSpaceMembers)
);

router.delete(
  "/:wID/members",
  isAuth,
  isAuthWorkspace,
  handleErrorAsync(workSpaceController.deleteWorkSpaceMembers)
);

module.exports = router;
