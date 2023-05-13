const jwt = require("jsonwebtoken");
const BoardModel = require("../models/boards");
const WorkSpaceModel = require("../models/workSpaces");
const validator = require("validator");
// const { isAuth } = require("../service/auth");
const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const User = require("../models/users");
const board = {
  //B03-1	新增看板 ----------------------------------------------------------------------------------
  async addBoard(req, res, next) {
    const errorArray = [];
    const userID = req.user.id;
    const { title, discribe, viewSet, workSpaceId } = req.body;

    //檢查欄位
    if (!title || !discribe || !viewSet || !workSpaceId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (!validator.isLength(title, { max: 10 })) {
      errorArray.push("看板名稱不可超過長度10！");
    }
    if (!validator.isLength(discribe, { max: 100 })) {
      errorArray.push("看板描述不可超過長度100！");
    }
    if (!["private", "public"].includes(viewSet)) {
      errorArray.push("不正確的看板權限設定！");
    }

    if (errorArray.length > 0) {
      return appError(400, errorArray, next);
    }

    const findBoard = await WorkSpaceModel.findById(workSpaceId);
    if (!findBoard || findBoard.length == 0) {
      return appError(400, "查無此工作區", next);
    }
    //看板成員是建立者，並且是管理員
    const member = [{ userId: userID, role: "admin" }];
    const newBoard = await new BoardModel({
      title,
      discribe,
      viewSet,
      createUser: userID,
      members: member,
    });

    await newBoard
      .save()
      .then()
      .catch((error) => {
        return appError(400, `新增看板失敗${error}`, next);
      });

    //新增看板ID到所屬工作區
    await findBoard.boards.push(newBoard._id);
    await findBoard
      .save()
      .then(() => {
        handleSuccess(res, "新增看板成功", newBoard._id);
      })
      .catch((err) => {
        return appError(400, `新增看板ID到所屬工作區失敗${error}`, next);
      });
  },

  //
  async getOneBoard(req, res, next) {
    const boardID = req.params.bID;
    let userID = "";
    let yourRole = "visitor";
    let yourPermission = "viewOnly";
    let message = "查詢成功，此為公開看板";

    if (boardID.length < 24) {
      return appError(400, "您的請求參數有誤", next);
    }
    const findBoard = await BoardModel.findById(boardID)
      .populate({
        path: "lists",
        select: "title position",
      })
      .populate({
        path: "members.userId",
        select: "name",
      })
      .select("title discribe coverPath viewSet members lists");
    if (!findBoard || findBoard.length == 0) {
      return appError(400, "查無此看板", next);
    }

    //#region  檢查使用者權限  訪客/成員/管理員
    //確認token是否存在
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
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

      //decoded.id回傳resolve(payload)
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next(appError(401, "查無此使用者，請重新登入", next));
      }
      if (currentUser.token == "") {
        return next(appError(401, "您目前為登出狀態請先登入", next));
      }

      userID = currentUser._id;
    }

    //#endregion

    if (userID) {
      const index = findBoard.members.findIndex(
        (element) => element.userId._id.toString() == userID.toString()
      );
      if (index !== -1) {
        yourRole = findBoard.members[index].role;
        yourPermission = "edit";
      }
    }

    if (findBoard.viewSet == "private") {
      if (yourRole == "visitor" && userID == "") {
        return next(appError(401, "此為私人看板，訪客請先登入", next));
      }
      if (yourRole == "visitor" && userID != "") {
        return next(
          appError(403, "此為私人看板，您不是看板成員，不可查看", next)
        );
      } else {
        message = "查詢成功，此為私人看板，您有編輯權限";
      }
    }

    const finalRes = {
      ...findBoard._doc,
      yourRole: yourRole,
      yourPermission: yourPermission,
    };

    handleSuccess(res, message, finalRes);
  },
};

module.exports = board;
