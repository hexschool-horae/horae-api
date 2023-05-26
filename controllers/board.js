const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");
const BoardModel = require("../models/boards");
const WorkSpaceModel = require("../models/workSpaces");
const boardTagsModel = require("../models/boardTags");
const listModel = require("../models/lists");
const validator = require("validator");
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
    if (!["private", "public", "workspace"].includes(viewSet)) {
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

  // //B03-5 取得單一看板----------------------------------------------------------------------------------
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
      // .populate({
      //   path: "lists",
      //   select: "title position",
      // })
      .populate({
        path: "members.userId",
        select: "name",
      })
      .select("title discribe coverPath viewSet members");
    if (!findBoard || findBoard.length == 0) {
      return appError(400, "查無此看板", next);
    }

    const listData = await listModel
      .find({ boardId: new ObjectId(boardID) })
      .populate({
        path: "cards",
        select: "title position startDate endDate tags proiority",
      })
      .select("title status position cards");

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
      // if (!currentUser) {
      //   return next(appError(401, "查無此使用者，請重新登入", next));
      // }
      // if (currentUser.token == "") {
      //   return next(appError(401, "您目前為登出狀態請先登入", next));
      // }
      if (currentUser) {
        userID = currentUser._id;
      }
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
      lists: listData,
      yourRole: yourRole,
      yourPermission: yourPermission,
    };

    handleSuccess(res, message, finalRes);
  },

  //B04-1	新增看板中列表----------------------------------------------------------------------------------
  async addlist(req, res, next) {
    const boardId = req.params.bID;
    const userID = req.user.id;
    const { title } = req.body;

    //檢查欄位
    if (!title) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (!validator.isLength(title, { max: 30 })) {
      return appError(400, "列表名稱不可超過長度30！", next);
    }

    let position = findBoard.lists.length;

    //列表建立
    const newlist = await new listModel({
      title,
      position,
      boardId,
      createUser: userID,
    });

    await newlist
      .save()
      .then(() => {})
      .catch((error) => {
        return appError(400, `新增列表失敗${error}`, next);
      });

    //新增列表ID到所屬看板
    await findBoard.lists.push(newlist._id);
    await findBoard
      .save()
      .then(() => {
        handleSuccess(res, "新增列表成功", newlist._id);
      })
      .catch((error) => {
        return appError(400, `新增列表ID到所屬看板失敗${error}`, next);
      });
  },

  //標籤相關
  //B03-13	取得單一看板的所有標籤-------------------------------------------------------------------------------
  async getTags(req, res, next) {
    const boardId = req.params.bID;
    const userID = req.user.id;
    const findTags = await boardTagsModel
      .find({
        boardId: new ObjectId(boardId),
      })
      .select("-createUser -createdAt");

    if (!findTags || findTags.length == 0) {
      return appError(404, "此看板尚未建立標籤", next);
    }
    handleSuccess(res, "成功", findTags);
  },

  //B03-14	單一看板新增標籤-------------------------------------------------------------------------------------
  async addTag(req, res, next) {
    const boardId = req.params.bID;
    const userID = req.user.id;
    const { title, color } = req.body;

    //檢查欄位
    if (!title || !color) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (!validator.isLength(title, { max: 15 })) {
      return appError(400, "標籤名稱不可超過長度15！", next);
    }
    if (!color.startsWith("#") || color.length != 7) {
      return appError(400, "色票碼格式錯誤！", next);
    }
    //列表建立
    const newTags = await new boardTagsModel({
      title,
      color,
      boardId,
      createUser: userID,
    });

    await newTags
      .save()
      .then(() => {
        handleSuccess(res, "新增標籤成功");
      })
      .catch((error) => {
        if (err.name === "VersionError") {
          // 版本号不匹配
          return appError(
            400,
            "新增標籤失敗! 已被其他用戶修改，請重整後再試一次",
            next
          );
        }
        return appError(400, `新增標籤失敗${error}`, next);
      });
  },
  //B03-15	單一看板設定單一標籤---------------------------------------------------------------------------------
  async updateTag(req, res, next) {
    const boardId = req.params.bID;
    const userID = req.user.id;
    const { tagId, title, color } = req.body;

    //檢查欄位
    if (!tagId || !title || !color) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (!validator.isLength(title, { max: 15 })) {
      return appError(400, "標籤名稱不可超過長度15！", next);
    }
    if (!color.startsWith("#") || color.length != 7) {
      return appError(400, "色票碼格式錯誤！", next);
    }

    const findTag = await boardTagsModel.findById(tagId);
    if (!findTag || findTag.length == 0) {
      return appError(404, "查無此標籤", next);
    }
    // console.log("findTags", findTag);

    findTag.title = title;
    findTag.color = color;
    findTag.createdAt = Date.now();
    findTag.createUser = userID;

    await findTag
      .save()
      .then(() => {
        handleSuccess(res, "標籤設定成功");
      })
      .catch((err) => {
        if (err.name === "VersionError") {
          // 版本号不匹配
          return appError(
            400,
            "更新標籤失敗! 已被其他用戶修改，請重整後再試一次",
            next
          );
        }

        return appError(400, `更新標籤失敗${error}`, next);
      });
  },

  //B03-16	單一看板刪除標籤-------------------------------------------------------------------------------------
  async deleteTag(req, res, next) {
    const boardId = req.params.bID;
    const { tagId } = req.body;

    //檢查欄位
    if (!tagId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    const findTag = await boardTagsModel.findById(tagId);
    if (!findTag || findTag.length == 0) {
      return appError(404, "查無此標籤", next);
    }

    const deleteTag = await boardTagsModel.deleteOne({
      _id: tagId,
      boardId: new ObjectId(boardId),
    });
    if (deleteTag.acknowledged == false) {
      return appError(400, "標籤刪除失敗", next);
    }
    if (deleteTag.deletedCount == 0) {
      return appError(400, "標籤刪除失敗", next);
    }
    handleSuccess(res, "刪除成功");
  },
};

module.exports = board;
