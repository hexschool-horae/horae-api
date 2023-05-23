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

    // //工作區成員是建立者，並且是管理員
    const member = [{ userId: userID, role: "admin" }];
    const newWorkSpace = new WorkSpaceModel({
      title,
      discribe,
      viewSet,
      createUser: userID,
      members: member,
    });
    await newWorkSpace
      .save()
      .then(() => {
        handleSuccess(res, "新增工作區成功", newWorkSpace._id);
      })
      .catch((error) => {
        return appError(400, `新增工作區失敗${error}`, next);
      });

    //下面的語法可以新增資料庫但是會出現 validation 錯誤
    // const member = [{ userId: userID, role: "admin" }];
    // const addWorkSpace = await WorkSpaceModel.create(
    //   {
    //     title,
    //     discribe,
    //     viewSet,
    //     createUser: userID,
    //     members: member,
    //   },
    //   { new: true }
    // );
    // console.log("addWorkSpace", addWorkSpace);
    // try {
    //   await newWorkSpace.save(); // 將新的工作區文檔保存到資料庫
    //   console.log(newWorkSpace._id);
    //   handleSuccess(res, "新增工作區成功", addWorkSpace);
    // } catch (err) {
    //   console.log(err);
    //   return appError(400, "新增工作區失敗", next);
    // }
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
    const findWorkSpace = await WorkSpaceModel.findById(workSpaceID)
      // .populate({
      //   path: "members.userId",
      //   select: "name",
      // })
      .populate({
        path: "boards",
        select: "title",
      })
      .select("title discribe viewSet status boards");

    if (!findWorkSpace) {
      return appError(400, "工作區不存在", next);
    }

    const finalRes = {
      ...findWorkSpace._doc,
      yourRole: req.workSpaceRole,
      yourPermission: "edit",
    };

    handleSuccess(res, "查詢成功", finalRes);
  },

  //B02-6	取得單一工作區成員----------------------------------------------------------------------------------
  async getWorkSpaceMembers(req, res, next) {
    const workSpaceID = req.params.wID;
    const findWorkSpace = await WorkSpaceModel.findById(workSpaceID)
      .populate({
        path: "members.userId",
        select: "name email",
      })
      .select("title viewSet members -_id");
    handleSuccess(res, "查詢成功", findWorkSpace);
  },

  //B02-7	單一工作區產生邀請連結
  async invitationLink(req, res, next) {
    const workSpaceID = req.params.wID;
    const findWorkSpace = await WorkSpace.findById(workSpaceID);
    let inviteHashData = "";

    if (findWorkSpace.inviteHashData == "") {
      //inviteHashData = await bcrypt.hash(workSpaceID, 12);
      //bcrypt.hash()的方法有特殊字元會出錯，所以改用亂數
      inviteHashData = Math.floor(Math.random() * 1000000000000);

      const updateWorkSpace = await WorkSpaceModel.findOneAndUpdate(
        {
          _id: workSpaceID,
        },
        { inviteHashData }
      );
      //console.log("updateWorkSpace", updateWorkSpace);

      if (!updateWorkSpace) {
        return appError(400, "產生工作區連結失敗", next);
      }
    } else {
      inviteHashData = findWorkSpace.inviteHashData;
    }
    // 產生邀請連結
    const invitationLink = `${process.env.FONT_END}/workspace/${workSpaceID}/members/${inviteHashData}`;

    handleSuccess(res, "產生邀請連結成功", { invitationLink: invitationLink });
  },

  //B02-8	單一工作區寄email給被邀請人

  //B02-9	單一工作區新增成員----------------------------------------------------------------------------------
  async addWorkSpaceMembers(req, res, next) {
    console.log("addWorkSpaceMembers");

    const userId = req.user.id;
    const workSpaceID = req.params.wID;
    const reqhashData = req.params.hashData;
    console.log("userId", userId);
    console.log("workSpaceID", workSpaceID);
    console.log("reqhashData", reqhashData);

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
  async updateWorkSpaceMembers(req, res, next) {
    const workSpaceID = req.params.wID;
    const { role, userId } = req.body;
    const findWorkSpace = await WorkSpaceModel.findById(workSpaceID).populate({
      path: "members.userId",
      select: "name email",
    });

    if (!role || !userId) {
      return appError(400, "參數錯誤，請重新輸入", next);
    }

    if (!["admin", "editor"].includes(role)) {
      return appError(400, "不正確的角色設定！", next);
    }

    //找到members是否有包含此id
    const index = findWorkSpace.members.findIndex(
      (element) => element.userId._id.toString() == userId
    );

    // console.log(index);
    if (index !== -1) {
      //console.log(findWorkSpace.members[index]);
      findWorkSpace.members[index].role = role;
    } else {
      return appError(400, "查無此成員，設定成員權限失敗", next);
    }

    //檢查修改後的member角色有沒有admin
    const adminIndex = findWorkSpace.members.findIndex(
      (element) => element.role.toString() == "admin"
    );

    if (adminIndex == -1) {
      return appError(400, "設定成員權限失敗，工作區至少要一個管理員", next);
    }

    await findWorkSpace
      .save()
      .then(() => {
        handleSuccess(res, "成員權限設定成功", findWorkSpace.members);
      })
      .catch((err) => {
        return appError(400, err, next);
      });
  },

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

    //檢查修改後的member角色有沒有admin
    const adminIndex = findWorkSpace.members.findIndex(
      (element) => element.role.toString() == "admin"
    );
    //console.log("adminIndex", adminIndex);

    if (adminIndex == -1) {
      return appError(400, "成員移除失敗，工作區至少要一個管理員", next);
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
