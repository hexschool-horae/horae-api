const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const listModel = require("../models/lists");
const boardModel = require("../models/boards");
const cardModel = require("../models/cards");
const validator = require("validator");
const ObjectId = require("mongoose").Types.ObjectId;

const list = {
  //B05-1	新增列表中卡片----------------------------------------------------------------------------------
  async addCard(req, res, next) {
    const listId = req.params.lID;
    const errorArray = [];
    const userID = req.user.id;
    const { title } = req.body;

    //檢查欄位
    if (!title) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (!validator.isLength(title, { max: 200 })) {
      errorArray.push("卡片名稱不可超過長度200！");
    }

    if (errorArray.length > 0) {
      return appError(400, errorArray, next);
    }

    const findList = await listModel.findById(listId);
    if (!findList || findList.length == 0) {
      return appError(400, "查無此列表，請重新輸入列表編號", next);
    }

    let position = findList.cards.length;
    const boardId = findList.boardId;
    console.log("findList.boardID", boardId);

    //卡片建立
    const newCard = await new cardModel({
      title,
      position,
      list: listId,
      boardId,
      createUser: userID,
      updateUser: userID,
    });

    await newCard
      .save()
      .then(() => {})
      .catch((error) => {
        return appError(400, `新增卡片失敗${error}`, next);
      });
    // //新增卡片ID到所屬列表
    await findList.cards.push(newCard._id);
    await findList
      .save()
      .then(() => {
        handleSuccess(res, "新增卡片成功", newCard._id);
      })
      .catch((error) => {
        return appError(400, `新增卡片ID到所屬列表失敗${error}`, next);
      });
  },

  //B04-2	修改列表標題 ----------------------------------------------------------------------------------
  async updateListTitle(req, res, next) {
    const listId = req.params.lID;
    const userID = req.user.id;
    const { title } = req.body;
    if (!title) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (!validator.isLength(title, { max: 30 })) {
      return appError(400, "列表名稱不可超過長度30！", next);
    }

    //修改
    const updateList = await listModel.findOneAndUpdate(
      {
        _id: listId,
      },
      { title, createUser: userID }
    );

    if (!updateList) {
      return appError(400, "列表標題修改失敗", next);
    }
    handleSuccess(res, "修改成功");
  },

  //B04-3	開啟/關閉單一列表----------------------------------------------------------------------------------
  async updateListStatus(req, res, next) {
    const listId = req.params.lID;
    const userID = req.user.id;
    const { status } = req.body;
    if (!status) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (!["open", "close"].includes(status)) {
      return appError(400, "不正確的列表封存設定參數！", next);
    }

    //修改
    const updateList = await listModel.findOneAndUpdate(
      {
        _id: listId,
      },
      { status, createUser: userID }
    );

    if (!updateList) {
      return appError(400, "列表封存設定失敗", next);
    }
    handleSuccess(res, "修改成功");
  },

  //B04-4 移動列表位置----------------------------------------------------------------------------------
  async moveList(req, res, next) {
    const listId = req.params.lID;
    const boardId = req.boardId;
    // const userID = req.user.id;
    const finalPosition = req.body.finalPosition;
    if (finalPosition == undefined) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (typeof finalPosition != "number") {
      return appError(400, "不正確的position設定參數！", next);
    }

    if (finalPosition < 0) {
      return appError(400, "position參數不可為負數！", next);
    }

    const findAllLists = await boardModel.findById(boardId);
    if (finalPosition > findAllLists.lists.length - 1) {
      return appError(400, "position參數不可超過列表數字！", next);
    }

    const findList = await listModel.findById(listId);
    const originalPosition = findList.position;

    if (originalPosition == finalPosition) {
      return appError(400, "position參數和原本相同！", next);
    }
    //原本位置 > 最後位置 : 資料庫中大於最後位置的其他資料的位置要+1
    //原本位置 < 最後位置 : 資料庫中小於最後位置的其他資料的位置要-1
    const condition = {
      $and: [
        { boardId: new ObjectId(boardId) },
        {
          position: {
            [originalPosition > finalPosition ? "$gte" : "$lte"]: finalPosition,
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

    // const test = await listModel.find(condition);
    // console.log("test", test);
    // handleSuccess(res, "位置移動成功", test);
    await listModel
      .updateMany(condition, {
        $inc: { position: operation },
      })
      .then(() => {})
      .catch((err) => {
        return appError(400, `列表位置移動失敗${error}`, next);
      });

    let updateList = await listModel.findOneAndUpdate(
      {
        _id: new ObjectId(listId),
      },
      { position: finalPosition }
    );

    if (!updateList) {
      return appError(500, "列表位置移動失敗", next);
    }

    handleSuccess(res, "位置移動成功");
  },
};

module.exports = list;
