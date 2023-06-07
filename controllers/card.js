const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const cardModel = require("../models/cards");
const boardTagsModel = require("../models/boardTags");
const commentModel = require("../models/cardComment");
const todolistModel = require("../models/cardTodolist");

const validator = require("validator");

const card = {
  //B05-2	修改單一卡片(基本資訊)----------------------------------------------------------------------------------
  async updateCardData(req, res, next) {
    const userID = req.user.id;

    const cardID = req.params.cardID;
    const { title, describe, proiority } = req.body;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    if (!title || !describe || !proiority) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (!validator.isLength(title, { max: 200 })) {
      return appError(400, "卡片名稱不可超過長度200！", next);
    }

    if (!["1", "2", "3", "4"].includes(proiority)) {
      return appError(400, "不正確的卡片優先權設定！", next);
    }

    if (startDate == null && endDate == null) {
    } else {
      // 檢查時間是否為數字
      if (typeof startDate != "number" || typeof endDate != "number") {
        return appError(400, "不正確的日期格式！", next);
      }

      const stimestamp = parseInt(startDate, 10);
      const etimestamp = parseInt(endDate, 10);

      // 檢查時間戳記是否有效
      if (
        isNaN(stimestamp) ||
        stimestamp < 0 ||
        isNaN(etimestamp) ||
        etimestamp < 0
      ) {
        return appError(400, "不正確的日期格式！", next);
      }

      const sdate = new Date(stimestamp);
      const edate = new Date(etimestamp);

      // 檢查日期是否有效
      if (isNaN(sdate.getTime()) || isNaN(edate.getTime())) {
        return appError(400, "不正確的日期格式！", next);
      }

      if (startDate > endDate) {
        return appError(400, "開始時間不可大於結束時間！", next);
      }
    }
    //修改
    const updateCard = await cardModel.findOneAndUpdate(
      {
        _id: cardID,
      },
      {
        title,
        describe,
        startDate,
        endDate,
        proiority,
        updatUser: userID,
        updateAt: Date.now(),
      }
    );

    if (!updateCard) {
      return appError(400, "看板權限修改失敗", next);
    }

    handleSuccess(res, "修改成功");
  },

  //B05-4 取得單一卡片----------------------------------------------------------------------------------
  async getOneCard(req, res, next) {
    const cardID = req.params.cardID;
    const findCard = await cardModel
      .findById(cardID)
      .populate({
        path: "tags",
        select: "_id title color",
      })
      .populate({
        path: "comments",
        select: "_id createdAt comment user -card",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "todolists.contentList",
        select: "_id content completed",
        //options: { sort: { createdAt: -1 } },
      })
      .select("-viewSet -status -list -createUser");

    if (!findCard || findCard.length == 0) {
      return appError(400, "查無此卡片", next);
    }
    handleSuccess(res, "查詢成功", findCard);
  },

  //B05-9 在卡片新增標籤----------------------------------------------------------------------------------
  async addCardTag(req, res, next) {
    const cardID = req.params.cardID;

    const userID = req.user.id;
    const boardId = req.boardId;

    //console.log("addCardTag boardId", boardId);

    const { tagId } = req.body;
    if (!tagId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    const findBoardTag = await boardTagsModel.findById(tagId);
    if (!findBoardTag || findBoardTag.length == 0) {
      return appError(400, "查無此標籤", next);
    }

    if (findBoardTag.boardId.toString() != boardId.toString()) {
      return appError(400, "此標籤不屬於此看板", next);
    }

    const findCard = await cardModel.findById(cardID);
    //找到卡片的tags是否有包含此id
    const index = findCard.tags.findIndex(
      (element) => element.toString() == tagId
    );
    if (index !== -1) {
      return appError(400, "此標籤已經存在卡片，不可新增", next);
    }

    //新增標籤ID到所屬卡片
    await findCard.tags.push(tagId);
    await findCard
      .save()
      .then(() => {
        handleSuccess(res, "新增成功");
      })
      .catch((error) => {
        return appError(400, `在卡片新增標籤失敗${error}`, next);
      });
  },

  //B05-10 在卡片移除標籤----------------------------------------------------------------------------------
  async deleteCardTag(req, res, next) {
    const cardID = req.params.cardID;

    const userID = req.user.id;
    const { tagId } = req.body;
    if (!tagId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    const findBoardTag = await boardTagsModel.findById(tagId);
    if (!findBoardTag || findBoardTag.length == 0) {
      return appError(400, "查無此標籤", next);
    }

    const boardId = req.boardId;
    if (findBoardTag.boardId.toString() != boardId.toString()) {
      return appError(400, "此標籤不屬於此看板", next);
    }

    const findCard = await cardModel.findById(cardID);

    //找到tags是否有包含此id
    const index = findCard.tags.findIndex(
      (element) => element.toString() == tagId
    );

    if (index !== -1) {
      findCard.tags.splice(index, 1); //.splice(要刪除的索引開始位置, 要刪除的元素數量)
    } else {
      return appError(400, "卡片上查無此標籤，移除失敗", next);
    }

    //移除標籤ID
    await findCard
      .save()
      .then(() => {
        handleSuccess(res, "移除成功");
      })
      .catch((error) => {
        return appError(400, `在卡片移除標籤失敗${error}`, next);
      });
  },

  //B05-11 卡片評論新增----------------------------------------------------------------------------------
  async addCardComment(req, res, next) {
    const cardId = req.params.cardID;
    const userID = req.user.id;
    const { comment } = req.body;
    if (!comment) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    //列表建立
    const newComment = await new commentModel({
      comment,
      card: cardId,
      user: userID,
    });

    await newComment
      .save()
      .then(() => {
        handleSuccess(res, "新增成功", newComment._id);
      })
      .catch((error) => {
        return appError(400, `新增評論失敗${error}`, next);
      });
  },

  //B05-12 卡片評論修改----------------------------------------------------------------------------------
  //非本人的評論不可以修改
  async updateCardComment(req, res, next) {
    const userID = req.user.id;
    const { commentId, comment } = req.body;

    //檢查欄位
    if (!commentId || !comment) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    const findComment = await commentModel.findById(commentId);
    if (!findComment || findComment.length == 0) {
      return appError(404, "查無此評論", next);
    }
    console.log("findComment.user._id", findComment.user._id.toString());
    console.log("userID", userID);

    if (findComment.user._id.toString() != userID) {
      return appError(400, "非本人的評論不可以修改", next);
    }

    findComment.comment = comment;
    //findComment.createdAt = Date.now();
    findComment.user = userID;

    await findComment
      .save()
      .then(() => {
        handleSuccess(res, "評論修改成功");
      })
      .catch((err) => {
        if (err.name === "VersionError") {
          // 版本号不匹配
          return appError(
            400,
            "更新評論失敗! 已被其他用戶修改，請重整後再試一次",
            next
          );
        }

        return appError(400, `更新評論失敗${error}`, next);
      });
  },

  //B05-13 卡片評論刪除----------------------------------------------------------------------------------
  async deleteCardComment(req, res, next) {
    const { commentId } = req.body;

    //檢查欄位
    if (!commentId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    const findComment = await commentModel.findById(commentId);
    if (!findComment || findComment.length == 0) {
      return appError(404, "查無此評論", next);
    }

    const deleteComment = await commentModel.deleteOne({
      _id: commentId,
    });
    if (deleteComment.acknowledged == false) {
      return appError(400, "評論刪除失敗", next);
    }
    if (deleteComment.deletedCount == 0) {
      return appError(400, "評論刪除失敗", next);
    }
    handleSuccess(res, "刪除成功");
  },

  //B05-14 卡片todolist新增標題-----------------------------------------------------------------------------------
  async addCardTodolist(req, res, next) {
    const cardId = req.params.cardID;

    const { title } = req.body;
    if (!title) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    const findCard = await cardModel.findById(cardId);

    let newTodolist = await findCard.todolists.push({ title });
    console.log("newTodolist", findCard.todolists[newTodolist - 1]._id);

    await findCard
      .save()
      .then(() => {
        handleSuccess(
          res,
          "成功加入todolist標題",
          findCard.todolists[newTodolist - 1]._id
        );
      })
      .catch((err) => {
        return appError(400, err, next);
      });
  },

  //B05-15 卡片todolist修改標題----------------------------------------------------------------------------------
  async updateCardTodolist(req, res, next) {
    const cardId = req.params.cardID;
    const { titleId, title } = req.body;

    //檢查欄位
    if (!titleId || !title) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    const findCard = await cardModel.findById(cardId);
    //檢查是否已經存在該Todolist
    const index = findCard.todolists.findIndex(
      (element) => element._id.toString() == titleId
    );

    if (index !== -1) {
      findCard.todolists[index].title = title;
    } else {
      return appError(400, "查無此Todolist，不可修改", next);
    }

    await findCard
      .save()
      .then(() => {
        handleSuccess(res, "Todolist修改成功");
      })
      .catch((err) => {
        if (err.name === "VersionError") {
          // 版本号不匹配
          return appError(
            400,
            "更新Todolist失敗! 已被其他用戶修改，請重整後再試一次",
            next
          );
        }

        return appError(400, `更新Todolist失敗${error}`, next);
      });
  },

  //B05-16 卡片todolist刪除一組(標題+細項)----------------------------------------------------------------------------------
  async deleteCardTodolist(req, res, next) {
    const cardId = req.params.cardID;
    const { titleId } = req.body;

    //檢查欄位
    if (!titleId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    const findContent = await todolistModel.find({
      title: titleId,
    });
    if (findContent.length > 0) {
      const deleteContent = await todolistModel.deleteMany({
        title: titleId,
      });
      if (deleteContent.acknowledged == false) {
        return appError(400, "Todolist刪除失敗", next);
      }
      if (deleteContent.deletedCount == 0) {
        return appError(400, "Todolist刪除失敗", next);
      }
    }
    const findCard = await cardModel.findById(cardId);
    //檢查是否已經存在該Todolist
    const index = findCard.todolists.findIndex(
      (element) => element._id.toString() == titleId
    );

    if (index !== -1) {
      findCard.todolists.splice(index, 1); //.splice(要刪除的索引開始位置, 要刪除的元素數量)
    } else {
      return appError(400, "查無此Todolist，刪除失敗", next);
    }
    await findCard
      .save()
      .then(() => {
        handleSuccess(res, "刪除成功");
      })
      .catch((err) => {
        if (err.name === "VersionError") {
          // 版本号不匹配
          return appError(
            400,
            "刪除Todolist失敗! 已被其他用戶修改，請重整後再試一次",
            next
          );
        }

        return appError(400, `刪除Todolist失敗${error}`, next);
      });
  },

  //B05-17 卡片todolist新增細項----------------------------------------------------------------------------------
  async addCardTodolistContent(req, res, next) {
    const cardId = req.params.cardID;
    const { titleId, content } = req.body;
    if (!titleId || !content) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    //列表建立
    const newContent = await new todolistModel({
      content,
      completed: false,
      title: titleId,
      card: cardId,
    });

    await newContent
      .save()
      .then(() => {})
      .catch((error) => {
        return appError(400, `新增todolist細項失敗${error}`, next);
      });

    //卡片上todolist標題下也要新增對應細項
    const findCard = await cardModel.findById(cardId);
    //檢查是否已經存在該Todolist
    const index = findCard.todolists.findIndex(
      (element) => element._id.toString() == titleId
    );

    if (index !== -1) {
      findCard.todolists[index].contentList.push(newContent._id);
    } else {
      return appError(400, "查無此Todolist標題，不可新增細項", next);
    }

    await findCard
      .save()
      .then(() => {
        handleSuccess(res, "Todolist新增細項成功", newContent._id);
      })
      .catch((err) => {
        if (err.name === "VersionError") {
          // 版本号不匹配
          return appError(
            400,
            "更新Todolist失敗! 已被其他用戶修改，請重整後再試一次",
            next
          );
        }

        return appError(400, `更新Todolist失敗${error}`, next);
      });
  },

  //B05-18 卡片todolist修改細項----------------------------------------------------------------------------------
  async updateCardTodolistContent(req, res, next) {
    const userID = req.user.id;
    const { contentId, content, completed } = req.body;

    //檢查欄位
    if (!contentId || !content) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (![true, false].includes(completed)) {
      return appError(400, "不正確的completed參數設定！", next);
    }
    const findContent = await todolistModel.findById(contentId);
    if (!findContent || findContent.length == 0) {
      return appError(404, "查無此todolist細項", next);
    }

    findContent.content = content;
    findContent.completed = completed;

    await findContent
      .save()
      .then(() => {
        handleSuccess(res, "todolist細項修改成功");
      })
      .catch((err) => {
        if (err.name === "VersionError") {
          // 版本号不匹配
          return appError(
            400,
            "更新todolist細項失敗! 已被其他用戶修改，請重整後再試一次",
            next
          );
        }

        return appError(400, `更新todolist細項失敗${error}`, next);
      });
  },

  //B05-19 卡片todolist刪除一個細項----------------------------------------------------------------------------------
  async deleteCardTodolistContent(req, res, next) {
    const cardId = req.params.cardID;
    const { contentId } = req.body;

    //檢查欄位
    if (!contentId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    const findContent = await todolistModel.findById(contentId);
    if (!findContent || findContent.length == 0) {
      return appError(404, "查無此評論", next);
    }
    const titleId = findContent.title;
    const deleteContent = await todolistModel.deleteOne({
      _id: contentId,
    });
    if (deleteContent.acknowledged == false) {
      return appError(400, "評論刪除失敗", next);
    }
    if (deleteContent.deletedCount == 0) {
      return appError(400, "評論刪除失敗", next);
    }

    //卡片上todolist標題下也要刪除對應細項
    const findCard = await cardModel.findById(cardId);
    //檢查是否已經存在該Todolist
    const index = findCard.todolists.findIndex(
      (element) => element._id.toString() == titleId
    );

    if (index !== -1) {
      let idx = findCard.todolists[index].contentList.indexOf(contentId);
      console.log("idx", idx);

      //findCard.todolists[index].contentList.push(newContent._id);
    } else {
      return appError(400, "查無此Todolist標題，不可新增細項", next);
    }
    await findCard
      .save()
      .then(() => {
        handleSuccess(res, "刪除成功");
      })
      .catch((err) => {
        if (err.name === "VersionError") {
          // 版本号不匹配
          return appError(
            400,
            "刪除Todolist失敗! 已被其他用戶修改，請重整後再試一次",
            next
          );
        }

        return appError(400, `刪除Todolist失敗${error}`, next);
      });

    handleSuccess(res, "刪除成功");
  },
};

module.exports = card;
