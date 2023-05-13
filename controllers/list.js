const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const listModel = require("../models/lists");
const boardModel = require("../models/boards");
const validator = require("validator");

const list = {
  //B04-1	新增列表中列表----------------------------------------------------------------------------------
  async addlist(req, res, next) {
    const errorArray = [];
    const userID = req.user.id;
    const { title, position, boardId } = req.body;

    //檢查欄位
    if (!title || !position || !boardId) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (!validator.isLength(title, { max: 10 })) {
      errorArray.push("列表名稱不可超過長度10！");
    }

    if (errorArray.length > 0) {
      return appError(400, errorArray, next);
    }
    //列表建立
    const newlist = await new listModel({
      title,
      position,
      board: boardId,
      createUser: userID,
    });

    const findBoard = await boardModel.findById(boardId);
    if (!findBoard || findBoard.length == 0) {
      return appError(400, "查無此看板，請重新輸入看板編號", next);
    }

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
      .catch((err) => {
        return appError(400, `新增列表ID到所屬看板失敗${error}`, next);
      });
  },
};

module.exports = list;
