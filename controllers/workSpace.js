const User = require("../models/users");
const WorkSpaceModel = require("../models/workSpaces");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { isAuth } = require("../service/auth");
const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const WorkSpace = require("../models/workSpaces");

const workSpace = {
  //B02-1	新增工作區 ----------------------------------------------------------------------------------
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
      errorArray.push("不正確的工作區權限設定！");
    }

    if (errorArray.length > 0) {
      return appError(400, errorArray, next);
    }
    //工作區成員是建立者，並且是管理員
    const member = [{ userId: userID, role: "admin" }];
    const addWorkSpace = WorkSpaceModel.create(
      {
        title,
        discribe,
        viewSet,
        creareUser: userID,
        members: member,
      },
      { new: true }
    );
    if (!addWorkSpace) {
      return appError(400, "新增工作區失敗", next);
    }

    handleSuccess(res, "新增工作區成功", addWorkSpace);
  },

  //B02-2	取得登入者所有工作區清單----------------------------------------------------------------------------------
  async getWorkSpaces(req, res, next) {
    const userID = req.user.id;
    const findWorkSpace = await WorkSpaceModel.find({
      "members.userId": { $in: userID },
    })
      .select("title _id")
      .sort({ createdAt: -1 });

    if (!findWorkSpace || findWorkSpace.length == 0) {
      return appError(400, "您沒有加入任何工作區", next);
    }

    handleSuccess(res, "查詢成功", findWorkSpace);
  },

  //B02-3	修改單一工作區資料(含權限)----------------------------------------------------------------------------------
  async updateOneWorkSpace(req, res, next) {
    const workSpaceID = req.params.wID;
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

    //修改
    const updateWorkSpace = await WorkSpaceModel.findOneAndUpdate(
      {
        _id: workSpaceID,
      },
      { title, discribe, viewSet, status }
    );

    if (!updateWorkSpace) {
      return appError(400, "工作區修改失敗", next);
    }
    handleSuccess(res, "修改成功");
  },

  //B02-4	刪除單一工作區----------------------------------------------------------------------------------
  async deleteOneWorkSpace(req, res, next) {
    const workSpaceID = req.params.wID;

    const deleteWorkSpace = await WorkSpaceModel.deleteOne({
      _id: workSpaceID,
    });
    if (deleteWorkSpace.acknowledged == false) {
      return appError(400, "工作區刪除失敗", next);
    }
    if (deleteWorkSpace.deletedCount == 0) {
      return appError(400, "工作區刪除失敗", next);
    }
    handleSuccess(res, "刪除成功");
  },

  //B02-5	取得單一工作區----------------------------------------------------------------------------------
  async getOneWorkSpace(req, res, next) {
    const workSpaceID = req.params.wID;
    const findWorkSpace = await WorkSpaceModel.findById(workSpaceID).populate({
      path: "members.userId",
      select: "name",
    });

    if (!findWorkSpace) {
      return appError(400, "工作區不存在", next);
    }
    handleSuccess(res, "查詢成功", findWorkSpace);
  },

  //B02-6	取得單一工作區成員----------------------------------------------------------------------------------
  async getWorkSpaceMembers(req, res, next) {
    const workSpaceID = req.params.wID;
    const findWorkSpace = await WorkSpaceModel.findById(workSpaceID)
      .populate({
        path: "members.userId",
        select: "name email",
      })
      .select("members -_id");
    handleSuccess(res, "查詢成功", findWorkSpace.members);
  },

  //B02-7	單一工作區產生邀請連結
  async invitationLink(req, res, next) {
    const workSpaceID = req.params.wID;
    const findWorkSpace = await WorkSpace.findById(workSpaceID);
    let inviteHashData = "";

    if (findWorkSpace.inviteHashData == "") {
      inviteHashData = await bcrypt.hash(workSpaceID, 12);

      const updateWorkSpace = await WorkSpaceModel.findOneAndUpdate(
        {
          _id: workSpaceID,
        },
        { inviteHashData }
      );
      console.log("updateWorkSpace", updateWorkSpace);

      if (!updateWorkSpace) {
        return appError(400, "產生工作區連結失敗", next);
      }
    } else {
      inviteHashData = findWorkSpace.inviteHashData;
    }
    // 產生邀請連結
    const invitationLink = `${process.env.FONT_END}/work-space/${workSpaceID}/member/${inviteHashData}`;

    handleSuccess(res, "產生邀請連結成功", { invitationLink: invitationLink });
  },

  //B02-8	單一工作區寄email給被邀請人

  //B02-9	單一工作區新增成員----------------------------------------------------------------------------------
  async addWorkSpaceMembers(req, res, next) {
    const userId = req.user.id;
    const workSpaceID = req.params.wID;
    const reqhashData = req.params.hashData;

    if (workSpaceID.length < 24) {
      return appError(400, "您的請求參數有誤", next);
    }

    const findWorkSpace = await WorkSpaceModel.findById(workSpaceID)
      .populate({
        path: "members.userId",
        select: "name email",
      })
      .select("inviteHashData members");
    if (!findWorkSpace || findWorkSpace.length == 0) {
      return appError(400, "查無此工作區", next);
    }
    //檢查hashData工作區邀請連結
    if (findWorkSpace.inviteHashData == "") {
      return appError(400, "此工作區未開放加入", next);
    }

    if (reqhashData !== findWorkSpace.inviteHashData) {
      return appError(400, "您使用的邀請連結異常", next);
    }

    //檢查是否已經存在該成員
    const index = findWorkSpace.members.findIndex(
      (element) => element.userId._id.toString() == userId
    );
    if (index !== -1) {
      return appError(400, "成員已經存在此工作區，不可新增", next);
    }

    // 新增成員
    const role = "editor";
    await findWorkSpace.members.push({ userId, role });
    await findWorkSpace
      .save()
      .then(() => {
        handleSuccess(res, "成功加入工作區");
      })
      .catch((err) => {
        return appError(400, err, next);
      });
  },

  //B02-10 單一工作區設定單一成員權限

  //B02-11 單一工作區刪除單一成員----------------------------------------------------------------------------------
  async deleteWorkSpaceMembers(req, res, next) {
    const workSpaceID = req.params.wID;
    const deleteUserID = req.body.userId;
    const findWorkSpace = await WorkSpaceModel.findById(workSpaceID).populate({
      path: "members.userId",
      select: "name email",
    });

    if (!deleteUserID) {
      return appError(400, "參數錯誤，請重新輸入", next);
    }
    //找到members是否有包含此id

    const index = findWorkSpace.members.findIndex(
      (element) => element.userId._id.toString() == deleteUserID
    );

    // console.log(index);
    if (index !== -1) {
      findWorkSpace.members.splice(index, 1); //.splice(要刪除的索引開始位置, 要刪除的元素數量)
    } else {
      return appError(400, "查無此成員，移除失敗", next);
    }

    await findWorkSpace
      .save()
      .then(() => {
        handleSuccess(res, "成員移除成功", findWorkSpace.members);
      })
      .catch((err) => {
        return appError(400, err, next);
      });
  },
};

module.exports = workSpace;
