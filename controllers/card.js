const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const cardModel = require("../models/cards");
const validator = require("validator");

const card = {
  //B05-2	修改單一卡片(基本資訊)----------------------------------------------------------------------------------
  async updateCardData(req, res, next) {
    const userID = req.user.id;

    const cardID = req.params.cardID;
    const { title, describe, startDate, endDate, proiority } = req.body;
    if (!title || !describe || !startDate || !endDate || !proiority) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (!validator.isLength(title, { max: 200 })) {
      return appError(400, "卡片名稱不可超過長度200！", next);
    }

    if (!["1", "2", "3", "4"].includes(proiority)) {
      return appError(400, "不正確的卡片優先權設定！", next);
    }

    // 檢查時間是否為數字
    if (!validator.isNumeric(startDate) || !validator.isNumeric(endDate)) {
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
      .select("-viewSet -status -list -createUser");

    if (!findCard || findCard.length == 0) {
      return appError(400, "查無此卡片", next);
    }
    handleSuccess(res, "查詢成功", findCard);
  },
};

module.exports = card;
