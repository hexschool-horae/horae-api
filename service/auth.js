const jwt = require("jsonwebtoken");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const User = require("../models/users");
const WorkSpaceModel = require("../models/workSpaces");
const boardModel = require("../models/boards");

//檢查是否有權限的middleware
const isAuth = handleErrorAsync(async (req, res, next) => {
  //確認token是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(appError(401, "您尚未登入", next));
  }

  //驗證token的正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  console.log("decoded", decoded);
  //decoded.id回傳resolve(payload)
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(appError(401, "查無此使用者，請重新登入", next));
  }
  if (currentUser.token == "") {
    return next(appError(401, "您目前為登出狀態請先登入", next));
  }
  req.user = currentUser;

  next();
});

// //產生JWT並回傳
const generateSendJWT = async (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  //更新User的token
  const updateToken = await User.findOneAndUpdate(
    { _id: user._id },
    { token: token }
  );

  if (!updateToken) {
    return next(appError(400, "系統異常，請洽管理員", next));
  }
  user.password = undefined;
  res.status(statusCode).json({
    success: "true",
    user: { token: token },
    message: "成功",
  });
};

//檢查userID是否有工作區使用權限的middleware
const isAuthWorkspace = handleErrorAsync(async (req, res, next) => {
  const workSpaceID = req.params.wID;
  const userID = req.user.id;

  if (workSpaceID.length < 24) {
    return appError(400, "您的請求參數有誤", next);
  }
  const findWorkSpace = await WorkSpaceModel.findById(workSpaceID);
  if (!findWorkSpace || findWorkSpace.length == 0) {
    return appError(404, "查無此工作區", next);
  }

  let isMember = false;
  let workSpaceRole = "";
  findWorkSpace.members.forEach((element) => {
    if (element.userId == userID) {
      isMember = true;
      workSpaceRole = element.role;
    }
  });
  if (isMember === false) {
    return appError(403, "您沒有此工作區權限", next);
  }
  req.workSpaceRole = workSpaceRole;
  next();
});

//檢查userID是否有看板使用權限的middleware
const isAuthBoard = handleErrorAsync(async (req, res, next) => {
  const boardID = req.params.bID;
  const userID = req.user.id;

  if (boardID.length < 24) {
    return appError(400, "您的請求參數有誤", next);
  }
  const findBoard = await boardModel.findById(boardID);
  if (!findBoard || findBoard.length == 0) {
    return appError(404, "查無此看板", next);
  }

  let isMember = false;
  let boardRole = "";
  const memberIndex = findBoard.members.findIndex(
    (element) => element.userId._id.toString() == userID.toString()
  );

  if (memberIndex !== -1) {
    isMember = true;
    boardRole = findBoard.members[memberIndex].role;
  }
  if (isMember === false) {
    return appError(403, "您沒有此看板權限", next);
  }
  req.boardRole = boardRole;
  next();
});

module.exports = { isAuth, generateSendJWT, isAuthWorkspace, isAuthBoard };
