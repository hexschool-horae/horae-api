const User = require("../models/users");
const WorkSpaceModel = require("../models/workSpaces");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { isAuth } = require("../service/auth");
const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");

const workSpace = {
  //取得所有工作區清單----------------------------------------------------------------------------------
  async getWorkSpaces(req, res, next) {
    console.log("getWorkSpaces");

    const findWorkSpace = await WorkSpaceModel.find().populate({
      path: "creareUser",
      select: "name",
    });
    if (!findWorkSpace) {
      return appError(400, "工作區不存在", next);
    }

    handleSuccess(res, "查詢成功", findWorkSpace);
  },

  //新增工作區----------------------------------------------------------------------------------
  async addWorkSpace(req, res, next) {
    const userID = req.user.id;
    const { title, discribe, viewSet } = req.body;
    //檢查欄位
    if (!title || !discribe || !viewSet) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    //console.log(title, discribe, viewSet, userID);
    const newWorkSpace = WorkSpaceModel.create(
      {
        title,
        discribe,
        viewSet,
        creareUser: userID,
      },
      { new: true }
    );

    if (!newWorkSpace) {
      return appError(400, "新增工作區失敗", next);
    }
    handleSuccess(res, "新增成功");
  },
  //取得單一工作區資料----------------------------------------------------------------------------------
  async getOneWorkSpace(req, res, next) {
    const workSpacdID = req.params.wID;
    const findWorkSpace = await WorkSpaceModel.findById(workSpacdID).populate({
      path: "creareUser",
      select: "name",
    });

    if (!findWorkSpace) {
      return appError(400, "工作區不存在", next);
    }
    handleSuccess(res, "查詢成功", findWorkSpace);
  },

  //修改單一工作區資料----------------------------------------------------------------------------------
  async updateOneWorkSpace(req, res, next) {
    const workSpacdID = req.params.wID;
    const { title, discribe, viewSet, isClose } = req.body;
    if (!title || !discribe || !viewSet || !isClose) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    const updateWorkSpace = await WorkSpaceModel.updateOne(
      {
        _id: workSpacdID,
      },
      { title, discribe, viewSet, isClose }
    );

    if (updateWorkSpace.upsertedCount == 0) {
      return appError(400, "工作區修改失敗", next);
    }
    handleSuccess(res, "修改成功");
  },

  //刪除單一工作區資料----------------------------------------------------------------------------------
  async deleteOneWorkSpace(req, res, next) {
    const workSpacdID = req.params.wID;

    const deleteWorkSpace = await WorkSpaceModel.deleteOne({
      _id: workSpacdID,
    });

    if (deleteWorkSpace.deletedCount == 0) {
      return appError(400, "工作區刪除失敗", next);
    }
    handleSuccess(res, "刪除成功");
  },

  //取得單一工作區成員----------------------------------------------------------------------------------
  async getWorkSpaceMembers(req, res, next) {
    const findWorkSpace = await WorkSpaceModel.find()
      .populate({
        path: "user",
        select: "name",
      })
      .populate({
        path: "members.userId",
        select: "name",
      });
    handleSuccess(res, "查詢成功", findWorkSpace);
  },
};

module.exports = workSpace;
