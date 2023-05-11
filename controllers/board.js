const User = require("../models/users");
const BoardModel = require("../models/boards");
const WorkSpaceModel = require("../models/workSpaces");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { isAuth } = require("../service/auth");
const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const Board = require("../models/boards");
const { model } = require("mongoose");
const { findByIdAndUpdate } = require("../models/workSpaces");
const WorkSpace = require("../models/workSpaces");

const board = {
  //B02-1	新增看板 ----------------------------------------------------------------------------------
  async addBoard(req, res, next) {
    const errorArray = [];
    const userID = req.user.id;
    const { title, discribe, viewSet, workSpaceId } = req.body;
    console.log("req.body", req.body);

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
    if (!["private", "public"].includes(viewSet)) {
      errorArray.push("不正確的看板權限設定！");
    }

    if (errorArray.length > 0) {
      return appError(400, errorArray, next);
    }
    //看板成員是建立者，並且是管理員
    const member = [{ userId: userID, role: "admin" }];
    // const newBoard = await BoardModel.create(
    //   {
    //     title: "ddd",
    //     discribe,
    //     viewSet,
    //     creareUser: "ssss",
    //     members: member,
    //   },
    //   { new: true }
    // );
    // if (!newBoard) {
    //   return appError(400, "新增看板失敗", next);
    // }
    const addWorkSpace = await WorkSpaceModel.create(
      {
        title,
        discribe,
        viewSet,
        creareUser: userID,
        members: member,
      },
      { new: true }
    );
    console.log("newBoard:");
    handleSuccess(res, "新增看板成功");
    // const updateWorkSpace =
    //   WorkSpaceModel.findById(workSpaceId).select("boards");
    // if (!updateWorkSpace || updateWorkSpace.length == 0) {
    //   return appError(400, "查無此工作區", next);
    // }

    // //新增看板ID到所屬工作區
    // await updateWorkSpace.boards.push(addBoard._id);
    // await updateWorkSpace
    //   .save()
    //   .then(() => {
    //     handleSuccess(res, "新增看板成功", addBoard);
    //   })
    //   .catch((err) => {
    //     return appError(400, "新增看板失敗", next);
    //   });
  },

  //
  async getBoards(req, res, next) {
    console.log("getBoards");

    const getBoards = BoardModel.find();
    handleSuccess(res, "ok", getBoards);
  },
};

module.exports = board;
