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
    const { title, position } = req.body;

    //檢查欄位
    if (!title || !position) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (!validator.isLength(title, { max: 200 })) {
      errorArray.push("卡片名稱不可超過長度200！");
    }

    if (errorArray.length > 0) {
      return appError(400, errorArray, next);
    }
    //卡片建立
    const newCard = await new cardModel({
      title,
      position,
      list: listId,
      createUser: userID,
    });

    const findList = await listModel.findById(listId);
    if (!findList || findList.length == 0) {
      return appError(400, "查無此列表，請重新輸入列表編號", next);
    }

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
};

module.exports = list;
