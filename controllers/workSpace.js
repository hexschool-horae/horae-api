const User = require("../models/users");
const WorkSpaceModel = require("../models/workSpaces");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { isAuth } = require("../service/auth");
const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");

const workSpace = {
  //取得登入者所有工作區清單----------------------------------------------------------------------------------
  async getWorkSpaces(req, res, next) {
    const userID = req.user.id;
    const findWorkSpace = await WorkSpaceModel.find({
      creareUser: userID,
      status: "open",
    })
      .populate({
        path: "creareUser",
        select: "name",
      })
      .sort({ createdAt: -1 });
    if (!findWorkSpace) {
      return appError(400, "工作區不存在", next);
    }

    handleSuccess(res, "查詢成功", findWorkSpace);
  },

  //新增工作區----------------------------------------------------------------------------------
  async addWorkSpace(req, res, next) {
    const errorArray = [];
    const userID = req.user.id;
    const { title, discribe, viewSet } = req.body;
    //檢查欄位
    if (!title || !discribe || !viewSet) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (!validator.isLength(title, { max: 10 })) {
      errorArray.push("工作區名稱不可超過長度10！");
    }
    if (!validator.isLength(discribe, { max: 100 })) {
      errorArray.push("工作區描述不可超過長度100！");
    }
    if (!["private", "public"].includes(viewSet)) {
      errorArray.push("不合法的工作區權限設定！");
    }

    if (errorArray.length > 0) {
      return appError(400, errorArray, next);
    }
    const addWorkSpace = WorkSpaceModel.create(
      {
        title,
        discribe,
        viewSet,
        creareUser: userID,
      },
      { new: true }
    );
    if (!addWorkSpace) {
      return appError(400, "新增工作區失敗", next);
    }

    handleSuccess(res, "新增成功", addWorkSpace);
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
    const errorArray = [];
    const { title, discribe, viewSet, status } = req.body;
    if (!title || !discribe || !viewSet || !status) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (!validator.isLength(title, { max: 10 })) {
      errorArray.push("工作區名稱不可超過長度10！");
    }
    if (!validator.isLength(discribe, { max: 100 })) {
      errorArray.push("工作區描述不可超過長度100！");
    }

    if (!["private", "public"].includes(viewSet)) {
      errorArray.push("不合法的工作區權限設定！");
    }
    if (!["open", "close"].includes(status)) {
      errorArray.push("不合法的工作區狀態設定！");
    }

    if (errorArray.length > 0) {
      return appError(400, errorArray, next);
    }

    const updateWorkSpace = await WorkSpaceModel.findOneAndUpdate(
      {
        _id: workSpacdID,
      },
      { title, discribe, viewSet, status }
    );

    if (!updateWorkSpace) {
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
    if (deleteWorkSpace.acknowledged == false) {
      return appError(400, "工作區刪除失敗", next);
    }
    if (deleteWorkSpace.deletedCount == 0) {
      return appError(400, "工作區刪除失敗", next);
    }
    handleSuccess(res, "刪除成功");
  },

  //取得單一工作區成員----------------------------------------------------------------------------------
  async getWorkSpaceMembers(req, res, next) {
    const workSpacdID = req.params.wID;
    const findWorkSpace = await WorkSpaceModel.findById(workSpacdID).populate({
      path: "members.userId",
      select: "name",
    });
    handleSuccess(res, "查詢成功", findWorkSpace);
  },
};

module.exports = workSpace;
