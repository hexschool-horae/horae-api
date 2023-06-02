const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const listModel = require("../models/lists");
const boardModel = require("../models/boards");
const cardModel = require("../models/cards");
const validator = require("validator");

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
};

module.exports = list;
