const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const cardModel = require("../models/cards");
const validator = require("validator");

const card = {
  //B05-4 取得單一卡片----------------------------------------------------------------------------------
  async getOneCard(req, res, next) {
    const cardID = req.params.cardID;
    const findCard = await cardModel
      .findById(cardID)
      .select("-viewSet -status -list -createUser");

    if (!findCard || findCard.length == 0) {
      return appError(400, "查無此看板", next);
    }
    handleSuccess(res, "查詢成功", findCard);
  },
};

module.exports = card;
