const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");
const BoardModel = require("../models/boards");
const WorkSpaceModel = require("../models/workSpaces");
const boardTagsModel = require("../models/boardTags");
const cardModel = require("../models/cards");
const listModel = require("../models/lists");
const validator = require("validator");
const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const User = require("../models/users");

const board = {
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
    const findBoard = await BoardModel.findById(boardId);

    if (!findBoard || findBoard.length == 0) {
      return appError(400, "查無此看板，請重新輸入看板編號", next);
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

  //B03-1	新增看板 ----------------------------------------------------------------------------------
  async addBoard(req, res, next) {
    const errorArray = [];
    const userID = req.user.id;
    const { title, discribe, viewSet, workSpaceId } = req.body;

    //檢查欄位
    if (!title || !viewSet || !workSpaceId) {
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
      return appError(400, "新增看板失敗! 查無此工作區", next);
    }
    //看板成員是建立者，並且是管理員
    const member = [{ userId: userID, role: "admin" }];
    const newBoard = await new BoardModel({
      title,
      discribe,
      viewSet,
      createUser: userID,
      members: member,
      workSpaceId,
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

  //B03-2	修改單一看板權限 ----------------------------------------------------------------------------------
  async updateBoardViewSet(req, res, next) {
    const boardId = req.params.bID;
    const userID = req.user.id;
    const { viewSet } = req.body;
    if (!viewSet) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (!["private", "workspace", "public"].includes(viewSet)) {
      return appError(400, "不合法的看板權限設定！", next);
    }

    //修改
    const updateBoard = await BoardModel.findOneAndUpdate(
      {
        _id: boardId,
      },
      { viewSet, createUser: userID }
    );

    if (!updateBoard) {
      return appError(400, "看板權限修改失敗", next);
    }
    handleSuccess(res, "修改成功");
  },
  //B03-3	看板封存設定 開啟/關閉 ----------------------------------------------------------------------------------
  async updateBoardStatus(req, res, next) {
    const boardId = req.params.bID;
    const userID = req.user.id;
    const { status } = req.body;
    if (!status) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (!["open", "close"].includes(status)) {
      return appError(400, "不合法的看板封存設定參數！", next);
    }

    //修改
    const updateBoard = await BoardModel.findOneAndUpdate(
      {
        _id: boardId,
      },
      { status, createUser: userID }
    );

    if (!updateBoard) {
      return appError(400, "看板封存設定失敗", next);
    }
    handleSuccess(res, "修改成功");
  },

  //B03-4	修改單一看板標題 ----------------------------------------------------------------------------------
  async updateBoardTitle(req, res, next) {
    const boardId = req.params.bID;
    const userID = req.user.id;
    const { title } = req.body;
    if (!title) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (!validator.isLength(title, { max: 10 })) {
      return appError(400, "看板名稱不可超過長度10！", next);
    }

    //修改
    const updateBoard = await BoardModel.findOneAndUpdate(
      {
        _id: boardId,
      },
      { title, createUser: userID }
    );

    if (!updateBoard) {
      return appError(400, "看板標題修改失敗", next);
    }
    handleSuccess(res, "修改成功");
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
        select: "name email avatar",
      })
      .select("title discribe coverPath viewSet covercolor status members");
    if (!findBoard || findBoard.length == 0) {
      return appError(400, "查無此看板", next);
    }

    const listData = await listModel
      .find({ boardId: new ObjectId(boardID) })
      .populate({
        path: "cards",
        select: "title position startDate endDate tags proiority comments",
        options: { sort: { position: 1 } },
        populate: {
          path: "tags comments members",
          select: "title color comment name email avatar",
        },
      })
      .select("title status position cards")
      .sort({ position: 1 });

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

  //B03-6	取得單一看板的所有成員---------------------------------------------------------------------------------
  async getBoardMembers(req, res, next) {
    const boardID = req.params.bID;
    const findBoard = await BoardModel.findById(boardID)
      .populate({
        path: "members.userId",
        select: "name email avatar",
      })
      .select("title viewSet members -_id");
    handleSuccess(res, "查詢成功", findBoard);
  },

  //B03-7	單一看板新增成員---------------------------------------------------------------------------------
  async addBoardMembers(req, res, next) {
    const userId = req.user.id;
    const boardID = req.params.bID;
    const reqhashData = req.params.hashData;
    // console.log("userId", userId);
    // console.log("boardID", boardID);
    // console.log("reqhashData", reqhashData);

    if (boardID.length < 24) {
      return appError(400, "您的請求參數有誤", next);
    }

    const findBoard = await BoardModel.findById(boardID)
      .populate({
        path: "members.userId",
        select: "name email avatar",
      })
      .select("inviteHashData members");
    if (!findBoard || findBoard.length == 0) {
      return appError(400, "查無此看板", next);
    }

    ////////////////////////////////////////////////
    const indexHash = findBoard.members.findIndex(
      (element) => element.inviteHashData.toString() == reqhashData
    );

    if (indexHash == -1) {
      return appError(400, "此板邀請連結異常或是已失效", next);
    }

    /////////////////////////////////////////////
    const role = "editor";
    const findWorkSpace = await WorkSpaceModel.find({
      boards: { $in: new ObjectId(boardID) },
    });
    // console.log("findWorkSpace.members", findWorkSpace[0].members);

    const indexWorkSpace = findWorkSpace[0].members.findIndex(
      (element) => element.userId._id.toString() == userId
    );
    // console.log("indexWorkSpace", indexWorkSpace);

    //檢查工作區是否已經存在該成員
    if (indexWorkSpace == -1) {
      await findWorkSpace[0].members.push({ userId, role });
      await findWorkSpace[0]
        .save()
        .then(() => {})
        .catch((err) => {});
    }

    //檢查看板是否已經存在該成員
    const index = findBoard.members.findIndex(
      (element) => element.userId._id.toString() == userId
    );
    if (index !== -1) {
      return appError(400, "成員已經存在此看板，不可新增", next);
    }

    // 新增成員
    await findBoard.members.push({ userId, role });
    await findBoard
      .save()
      .then(() => {
        handleSuccess(res, "成功加入看板");
      })
      .catch((err) => {
        return appError(400, err, next);
      });
  },

  //B03-8	單一看板設定成員權限---------------------------------------------------------------------------------
  async updateBoardMembers(req, res, next) {
    const boardID = req.params.bID;
    const { role, userId } = req.body;
    const findBoard = await BoardModel.findById(boardID).populate({
      path: "members.userId",
      select: "name email avatar",
    });

    if (!role || !userId) {
      return appError(400, "參數錯誤，請重新輸入", next);
    }

    if (!["admin", "editor"].includes(role)) {
      return appError(400, "不正確的角色設定！", next);
    }

    //找到members是否有包含此id
    const index = findBoard.members.findIndex(
      (element) => element.userId._id.toString() == userId
    );

    // console.log(index);
    if (index !== -1) {
      //console.log(findBoard.members[index]);
      findBoard.members[index].role = role;
    } else {
      return appError(400, "查無此成員，設定成員權限失敗", next);
    }

    //檢查修改後的member角色有沒有admin
    const adminIndex = findBoard.members.findIndex(
      (element) => element.role.toString() == "admin"
    );

    if (adminIndex == -1) {
      return appError(400, "設定成員權限失敗，看板至少要一個管理員", next);
    }

    await findBoard
      .save()
      .then(() => {
        handleSuccess(res, "成員權限設定成功", findBoard.members);
      })
      .catch((err) => {
        return appError(400, err, next);
      });
  },

  //B03-9	單一看板刪除成員---------------------------------------------------------------------------------
  async deleteBoardMembers(req, res, next) {
    const boardID = req.params.bID;
    const deleteUserID = req.body.userId;
    const findBoard = await BoardModel.findById(boardID).populate({
      path: "members.userId",
      select: "name email avatar",
    });

    if (!deleteUserID) {
      return appError(400, "參數錯誤，請重新輸入", next);
    }
    //找到members是否有包含此id
    const index = findBoard.members.findIndex(
      (element) => element.userId._id.toString() == deleteUserID
    );

    // console.log(index);
    if (index !== -1) {
      findBoard.members.splice(index, 1); //.splice(要刪除的索引開始位置, 要刪除的元素數量)
    } else {
      return appError(400, "查無此成員，移除失敗", next);
    }

    //檢查修改後的member角色有沒有admin
    const adminIndex = findBoard.members.findIndex(
      (element) => element.role.toString() == "admin"
    );
    //console.log("adminIndex", adminIndex);

    if (adminIndex == -1) {
      return appError(400, "成員移除失敗，看板至少要一個管理員", next);
    }

    await findBoard
      .save()
      .then(() => {
        //handleSuccess(res, "成員移除成功", findBoard.members);
      })
      .catch((err) => {
        return appError(400, err, next);
      });

    ///卡片成員移除=====================================================
    const findCard = await cardModel.find({
      $and: [{ members: { $in: deleteUserID } }, { boardId: boardID }],
    });

    let deleteMemberInCard = true;
    if (findCard || findCard.length > 0) {
      let index = -1;
      findCard.forEach((element) => {
        //console.log("element.members", element.members);

        index = element.members.findIndex(
          (member) => member.toString() == deleteUserID.toString()
        );

        if (index !== -1) {
          element.members.splice(index, 1); //.splice(要刪除的索引開始位置, 要刪除的元素數量)
        }

        //移除成員ID
        element
          .save()
          .then(() => {
            deleteMemberInCard = true;
          })
          .catch((error) => {
            deleteMemberInCard = false;
            return appError(400, `在卡片移除成員失敗${error}`, next);
          });
      });
    }

    // ///工作區成員移除=====================================================
    // const findWorkSpace = await WorkSpaceModel.find({
    //   boards: { $in: new ObjectId(boardID) },
    // });
    // // console.log("findWorkSpace.members", findWorkSpace[0].members);

    // const indexWorkSpace = findWorkSpace[0].members.findIndex(
    //   (element) => element.userId._id.toString() == deleteUserID
    // );
    // // console.log("indexWorkSpace", indexWorkSpace);

    // //檢查工作區是否已經存在該成員
    // if (indexWorkSpace !== -1) {
    //   // await findWorkSpace[0].members.push({ userId, role });
    //   await findWorkSpace[0].members.splice(indexWorkSpace, 1);
    //   await findWorkSpace[0]
    //     .save()
    //     .then(() => {})
    //     .catch((err) => {});
    // }

    if (deleteMemberInCard == true) {
      handleSuccess(res, "刪除成功");
    }
  },

  //B03-10 產生看板邀請連結---------------------------------------------------------------------------------
  async boardInvitationLink(req, res, next) {
    const userID = req.user.id;
    const boardID = req.params.bID;
    const findBoard = await BoardModel.findById(boardID);
    let inviteHash = "";

    const index = findBoard.members.findIndex(
      (element) => element.userId._id.toString() == userID
    );

    // console.log(index);
    if (index == -1) {
      return appError(400, "查無此成員，產生看板邀請連結失敗", next);
    }

    inviteHash = findBoard.members[index].inviteHashData;

    if (inviteHash == "") {
      inviteHash = Math.floor(Math.random() * 1000000000000);
      findBoard.members[index].inviteHashData = inviteHash;
    }
    await findBoard
      .save()
      .then(() => {
        // 產生邀請連結
        const boardInvitationLink = `${process.env.FONT_END}/board/${boardID}/members/${inviteHash}`;

        handleSuccess(res, "產生邀請連結成功", {
          invitationLink: boardInvitationLink,
        });
      })
      .catch((err) => {
        return appError(400, "產生看板連結失敗，" + err, next);
      });
  },

  //B03-11	寄看板邀請連結email給被邀請人---------------------------------------------------------------------------------

  //B03-12 取得看板邀請資料---------------------------------------------------------------------------------
  async getInvitationData(req, res, next) {
    const boardID = req.params.bID;
    const hashData = req.params.hashData;

    const findBoard = await BoardModel.findById(boardID).populate({
      path: "members.userId",
      select: "name email avatar",
    });

    if (!findBoard || findBoard.length == 0) {
      return appError(400, "看板不存在", next);
    }
    // console.log("findBoard.members", findBoard.members);

    const index = findBoard.members.findIndex(
      (element) => element.inviteHashData == hashData
    );

    // console.log(index);
    if (index == -1) {
      return appError(400, "此板邀請連結異常或是已失效", next);
    }

    handleSuccess(res, "成功", {
      title: findBoard.title,
      inviter: findBoard.members[index].userId.name,
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

    if (!findTags) {
      return appError(404, "此看板標籤異常", next);
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
    //
    const newTags = await new boardTagsModel({
      title,
      color,
      boardId,
      createUser: userID,
    });

    await newTags
      .save()
      .then(() => {
        handleSuccess(res, "新增標籤成功", newTags._id);
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

    const findCard = await cardModel.find({
      tags: { $in: tagId },
    });

    let deleteTagInCard = true;
    if (findCard || findCard.length > 0) {
      //卡片裡有標籤，要移除
      // console.log("findCard", findCard);

      let index = -1;
      findCard.forEach((element) => {
        // console.log("element.tags", element.tags);

        index = element.tags.findIndex(
          (tag) => tag.toString() == tagId.toString()
        );

        if (index !== -1) {
          element.tags.splice(index, 1); //.splice(要刪除的索引開始位置, 要刪除的元素數量)
        }

        //移除標籤ID
        element
          .save()
          .then(() => {
            deleteTagInCard = true;
          })
          .catch((error) => {
            deleteTagInCard = false;
            return appError(400, `在卡片移除標籤失敗${error}`, next);
          });
      });
    }

    if (deleteTagInCard == true) {
      handleSuccess(res, "刪除成功");
    }
  },

  //B03-19	更新看板封面- ----------------------------------------------------------------------------------
  async updateBoardCover(req, res, next) {
    const boardId = req.params.bID;
    const userID = req.user.id;
    const { fileURL } = req.body;
    if (!fileURL) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    //修改
    const updateBoard = await BoardModel.findOneAndUpdate(
      {
        _id: boardId,
      },
      { coverPath: fileURL }
    );

    if (!updateBoard) {
      return appError(400, "看板封面設定失敗", next);
    }
    handleSuccess(res, "修改成功");
  },

  //B03-20	刪除看板封面-----------------------------------------------------------------------------------
  async deleteBoardCover(req, res, next) {
    const boardId = req.params.bID;
    const userID = req.user.id;

    //修改
    const updateBoard = await BoardModel.findOneAndUpdate(
      {
        _id: boardId,
      },
      { coverPath: "" }
    );

    if (!updateBoard) {
      return appError(400, "看板封面刪除失敗", next);
    }
    handleSuccess(res, "刪除成功");
  },

  //B03-21	修改看板主題----------------------------------------------------------------------------------
  async updateBoardTheme(req, res, next) {
    const boardId = req.params.bID;
    const userID = req.user.id;
    const { covercolor } = req.body;
    if (!covercolor) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (!["theme1", "theme2", "theme3"].includes(covercolor)) {
      return appError(400, "不正確的看板主題設定！", next);
    }
    //修改
    const updateBoard = await BoardModel.findOneAndUpdate(
      {
        _id: boardId,
      },
      { covercolor: covercolor }
    );

    if (!updateBoard) {
      return appError(400, "看板主題設定失敗", next);
    }
    handleSuccess(res, "修改成功");
  },
};

module.exports = board;
