const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const cardModel = require("../models/cards");
const boardTagsModel = require("../models/boardTags");
const boardModel = require("../models/boards");
const listModel = require("../models/lists");
const commentModel = require("../models/cardComment");
const todolistModel = require("../models/cardTodolist");
const attachmentModel = require("../models/cardAttachment");

const userModel = require("../models/users");
const validator = require("validator");
const ObjectId = require("mongoose").Types.ObjectId;
const { v4: uuidv4 } = require("uuid");
//require("../service/firebase"); 不要放到全域
const firebaseAdmin = require("../service/firebase");
const bucket = firebaseAdmin.storage().bucket();

const card = {
  //B05-2	修改單一卡片(基本資訊)----------------------------------------------------------------------------------
  async updateCardData(req, res, next) {
    const userID = req.user.id;

    const cardID = req.params.cardID;
    const { title, describe, proiority } = req.body;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    if (!title) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (!validator.isLength(title, { max: 200 })) {
      return appError(400, "卡片名稱不可超過長度200！", next);
    }

    if (!["", "1", "2", "3", "4"].includes(proiority)) {
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
        path: "members",
        select: "name email avatar",
      })
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
      .populate({
        path: "attachments",
        select: "_id fileUrl fileName createdAt -card",
        //options: { sort: { createdAt: -1 } },
      });
    //.select("-viewSet -status -list -createUser");

    if (!findCard || findCard.length == 0) {
      return appError(400, "查無此卡片", next);
    }
    handleSuccess(res, "查詢成功", findCard);
  },

  //B05-8 移動卡片位置----------------------------------------------------------------------------------
  async moveCard(req, res, next) {
    // console.log("moveList");
    const cardID = req.params.cardID;
    const originalListId = req.listId;
    // const userID = req.user.id;
    const { finalPosition, finalListId } = req.body;
    if (finalPosition == undefined || !finalListId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (typeof finalPosition != "number") {
      return appError(400, "不正確的 finalPosition 設定參數！", next);
    }

    if (finalPosition < 0) {
      return appError(400, "位置不可為負數！", next);
    }

    const finalList = await listModel.findById(finalListId);
    if (!finalList || finalList.length == 0) {
      return appError(400, "查無此列表id", next);
    }

    const findCard = await cardModel.findById(cardID);
    const originalPosition = findCard.position;

    const originalList = await listModel.findById(originalListId);
    const index = originalList.cards.findIndex(
      (element) => element.toString() == cardID
    );
    console.log("cardID:", cardID);
    console.log("originalList.cards[index]:", originalList.cards[index]);

    // await originalList.cards.splice(index, 1); //.splice(要刪除的索引開始位置, 要刪除的元素數量)

    // //finalList的 Cards array新增cardId
    // await finalList.cards.push(cardID);

    //////////////////////////////////////

    if (originalListId == finalListId && originalPosition == finalPosition) {
      return appError(400, "卡片位置和原本相同！", next);
    }

    if (originalListId == finalListId) {
      if (finalPosition > finalList.cards.length - 1) {
        return appError(400, "位置不可超過卡片總數！", next);
      }

      //移動到相同的listId
      //原本位置 > 最後位置 : 資料庫中大於最後位置的其他資料的位置要+1
      //原本位置 < 最後位置 : 資料庫中小於最後位置的其他資料的位置要-1
      let condition = {
        $and: [
          { listId: new ObjectId(originalListId) },
          {
            position: {
              [originalPosition > finalPosition ? "$gte" : "$lte"]:
                finalPosition,
              [originalPosition > finalPosition ? "$lte" : "$gte"]:
                originalPosition,
            },
          },
        ],
      };

      let operation = 1;
      if (originalPosition < finalPosition) {
        operation = -1;
      }
      //console.log("condition", condition);
      // const test = await cardModel.find(condition);
      // handleSuccess(res, "位置移動成功", test);
      await cardModel
        .updateMany(condition, {
          $inc: { position: operation },
        })
        .then(() => {})
        .catch((err) => {
          return appError(400, `卡片位置移動失敗${err}`, next);
        });

      let updateCard = await cardModel.findOneAndUpdate(
        {
          _id: new ObjectId(cardID),
        },
        { position: finalPosition }
      );

      if (!updateCard) {
        return appError(500, "卡片位置移動失敗", next);
      }
    } else {
      if (finalPosition > finalList.cards.length) {
        return appError(400, "移動到的位置不正確！", next);
      }
      //移動到不同的listId
      //原本的listId : 資料庫中大於最後位置的其他資料的位置要-1
      //移動後的listId : 資料庫中大於最後位置的其他資料的位置要+1
      //originalList的 Cards array移除cardId
      //finalList的 Cards array新增cardId
      let arr = [originalListId, finalListId];
      for (let i = 0; i < 2; i++) {
        let condition = {
          $and: [
            { listId: new ObjectId(arr[i]) },
            {
              position: {
                $gte: i == 0 ? originalPosition : finalPosition,
              },
            },
          ],
        };

        let operation = 1;
        if (i == 0) {
          operation = -1;
        }

        // console.log("condition", condition);
        // console.log("operation", operation);

        // let test = await cardModel.find(condition);
        // console.log("test" + i, test);

        await cardModel
          .updateMany(condition, {
            $inc: { position: operation },
          })
          .then(() => {})
          .catch((err) => {
            return appError(400, `卡片位置移動失敗${err}`, next);
          });
      }
      //originalList的 Cards array移除cardId

      const originalList = await listModel.findById(originalListId);
      const index = originalList.cards.findIndex(
        (element) => element.toString() == cardID
      );

      await originalList.cards.splice(index, 1); //.splice(要刪除的索引開始位置, 要刪除的元素數量)
      await originalList
        .save()
        .then(() => {})
        .catch((error) => {
          return appError(400, `在原列表移除卡片失敗${error}`, next);
        });

      //finalList的 Cards array新增cardId
      await finalList.cards.push(cardID);
      await finalList
        .save()
        .then(() => {})
        .catch((error) => {
          return appError(400, `在新列表新增卡片失敗${error}`, next);
        });
    }

    let updateCard = await cardModel.findOneAndUpdate(
      {
        _id: new ObjectId(cardID),
      },
      { listId: new ObjectId(finalListId), position: finalPosition }
    );

    if (!updateCard) {
      return appError(500, "卡片位置移動失敗", next);
    }
    handleSuccess(res, "位置移動成功");
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

    //卡片評論建立
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

  //B05-20 卡片成員新增----------------------------------------------------------------------------------
  async addCardMember(req, res, next) {
    const cardID = req.params.cardID;

    //const userID = req.user.id;
    const boardId = req.boardId;

    //console.log("addCardMember boardId", boardId);

    const { memberId } = req.body;
    if (!memberId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    const findUser = await userModel.findById(memberId);
    if (!findUser || findUser.length == 0) {
      return appError(400, "查無此使用者", next);
    }

    const findBoard = await boardModel.findById(boardId);
    console.log("boardId", boardId);

    if (!findBoard || findBoard.length == 0) {
      return appError(400, "查無此看板", next);
    }
    const indexBoardMember = findBoard.members.findIndex(
      (element) => element.userId.toString() == memberId
    );

    if (indexBoardMember == -1) {
      return appError(400, "此使用者不屬於此看板", next);
    }

    const findCard = await cardModel.findById(cardID);
    //找到卡片的members是否有包含此id
    const index = findCard.members.findIndex(
      (element) => element.toString() == memberId
    );
    if (index !== -1) {
      return appError(400, "此成員已經存在卡片，不可新增", next);
    }

    //新增使用者ID到所屬卡片
    await findCard.members.push(memberId);
    await findCard
      .save()
      .then(() => {
        handleSuccess(res, "新增成功");
      })
      .catch((error) => {
        return appError(400, `在卡片新增成員失敗${error}`, next);
      });
  },

  //B05-21 卡片成員移除----------------------------------------------------------------------------------
  async deleteCardMember(req, res, next) {
    const cardID = req.params.cardID;
    const boardId = req.boardId;
    const userID = req.user.id;
    const { memberId } = req.body;
    if (!memberId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    const findUser = await userModel.findById(memberId);
    if (!findUser || findUser.length == 0) {
      return appError(400, "查無此使用者", next);
    }

    const findBoard = await boardModel.findById(boardId);
    if (!findBoard || findBoard.length == 0) {
      return appError(400, "查無此看板", next);
    }

    const findCard = await cardModel.findById(cardID);

    //找到members是否有包含此id
    const index = findCard.members.findIndex(
      (element) => element.toString() == memberId
    );

    if (index !== -1) {
      findCard.members.splice(index, 1); //.splice(要刪除的索引開始位置, 要刪除的元素數量)
    } else {
      return appError(400, "卡片上查無此成員，移除失敗", next);
    }

    //移除使用者ID
    await findCard
      .save()
      .then(() => {
        handleSuccess(res, "移除成功");
      })
      .catch((error) => {
        return appError(400, `在卡片移除成員失敗${error}`, next);
      });
  },

  //B05-22 卡片中附件上傳----------------------------------------------------------------------------------
  async addCardAttachment(req, res, next) {
    const cardId = req.params.cardID;
    const userID = req.user.id;

    if (!req.files.length) {
      return next(appError(400, "尚未上傳檔案", next));
    }
    // 取得上傳的檔案資訊列表裡面的第一個檔案
    const file = req.files[0];
    // console.log("file.originalname", file.originalname);

    // const fileName = `${uuidv4()}.${file.originalname.split(".").pop()}`;
    const fileName = file.originalname;
    const filePath = "attachments/" + cardId + "/" + fileName;

    const findAttachment = await attachmentModel.find({ filePath });
    if (findAttachment.length > 0) {
      return next(appError(400, "已存在同檔名檔案，請勿重複上傳", next));
    }
    //基於檔案的原始名稱建立一個 blob 物件
    //目錄就是在filebase上建資料夾 ex：url/attachments/檔名
    const blob = bucket.file(filePath);

    // 建立一個可以寫入 blob 的物件，建立串流通道還未寫入
    const blobStream = blob.createWriteStream();

    // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
    blobStream.on("finish", () => {
      // 設定檔案的存取權限
      const config = {
        action: "read", // 權限
        expires: "12-31-2500", // 網址的有效期限
      };

      //回傳已儲存網址
      blob.getSignedUrl(config, async (err, fileUrl) => {
        //卡片附件建立
        const newAttachment = await new attachmentModel({
          fileUrl,
          fileName,
          filePath,
          card: cardId,
          user: userID,
        });

        await newAttachment
          .save()
          .then(() => {
            handleSuccess(res, "新增成功", newAttachment);
          })
          .catch((error) => {
            return appError(400, `新增附件失敗${error}`, next);
          });
      });
    });

    // 如果上傳過程中發生錯誤，會觸發 error 事件
    blobStream.on("error", (err) => {
      res.status(500).send("上傳失敗");
    });

    // 將檔案的 buffer 寫入 blobStream
    blobStream.end(file.buffer);
  },

  //B05-23	卡片中附件刪除----------------------------------------------------------------------------------
  async deleteCardAttachment(req, res, next) {
    const { fileId } = req.body;
    console.log("fileId", fileId);

    //檢查欄位
    if (!fileId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    const findAttachment = await attachmentModel.findById(fileId);
    if (!findAttachment || findAttachment.length == 0) {
      return appError(404, "查無此附件", next);
    }

    await bucket
      .file(findAttachment.filePath)
      .delete()
      .then(function () {})
      .catch(function (error) {
        return appError(500, "附件刪除失敗" + error, next);
      });

    const deleteAttachment = await attachmentModel.deleteOne({
      _id: fileId,
    });
    if (deleteAttachment.acknowledged == false) {
      return appError(500, "附件資料庫資料刪除失敗", next);
    }
    if (deleteAttachment.deletedCount == 0) {
      return appError(500, "附件刪除失敗", next);
    }
    handleSuccess(res, "刪除成功");
  },
};

module.exports = card;
