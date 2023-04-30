const User = require("../models/users");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { isAuth, generateSendJWT } = require("../service/auth");
const appError = require("../service/appError");
const handleSuccess = require("../service/handleSuccess");
const passwordRule = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/;

const user = {
  //註冊---------------------------------------------------------------------------
  async signUp(req, res, next) {
    const { email, password } = req.body;
    const errorArray = [];

    //檢查欄位
    if (!email || !password) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    const findUser = await User.findOne({ email });

    if (findUser) {
      return appError(400, "此E-mail已經註冊，請登入系統", next);
    }

    if (!validator.isEmail(email)) {
      errorArray.push("E-mail格式錯誤");
    }

    if (!validator.isLength(password, { min: 8, max: 12 })) {
      errorArray.push("密碼至少需要輸入8到12碼");
    }

    if (!passwordRule.test(password)) {
      errorArray.push("密碼需含有英文與數字混合");
    }

    if (errorArray.length > 0) {
      return appError(400, errorArray, next);
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name: email.split("@")[0],
      email: email,
      password: hashPassword,
    });

    generateSendJWT(newUser, 201, res);
  },

  //登入---------------------------------------------------------------------------
  async login(req, res, next) {
    const errorArray = [];
    const { email, password } = req.body;

    //檢查欄位
    if (!email || !password) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }
    if (!validator.isEmail(email)) {
      errorArray.push("E-mail格式錯誤");
    }

    if (!validator.isLength(password, { min: 8, max: 12 })) {
      errorArray.push("密碼至少需要輸入8到12碼");
    }

    if (!passwordRule.test(password)) {
      errorArray.push("密碼需含有英文與數字混合");
    }

    if (errorArray.length > 0) {
      return appError(400, errorArray, next);
    }
    const findUser = await User.findOne({ email }).select("+email +password");
    if (!findUser) {
      return appError(400, "查無此使用者", next);
    }
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword || !findUser) {
      return appError(400, "您輸入的密碼錯誤", next);
    }

    generateSendJWT(findUser, 201, res);
  },

  //取得個人資料---------------------------------------------------------------------------
  async getProfile(req, res, next) {
    //console.log(req.user);

    const findUser = await User.findOne({ _id: req.user }).select(
      "name +email"
    );
    if (!findUser) {
      return appError(400, "使用者資料不存在", next);
    }
    handleSuccess(res, "成功", findUser);
  },
  //更新個人資料---------------------------------------------------------------------------
  async updateProfile(req, res, next) {
    const name = req.body.name;

    //檢查欄位
    if (!name) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (!validator.isLength(name, { max: 8 })) {
      return appError(400, "名字不可超過10個字", next);
    }

    const updateUser = await User.findOneAndUpdate({ _id: req.user }, { name });
    if (!updateUser) {
      return appError(400, "使用者資料更新錯誤", next);
    }

    handleSuccess(res, "使用者資料更新成功");
  },

  //更新個人密碼---------------------------------------------------------------------------
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;
    const userID = req.user;
    //檢查欄位
    if (!password || !confirmPassword) {
      return appError(400, "欄位輸入錯誤，請重新輸入", next);
    }

    if (!validator.isLength(password, { min: 8, max: 12 })) {
      return appError(400, "密碼至少需要輸入8到12碼", next);
    }

    if (password !== confirmPassword) {
      return appError(400, "2次密碼輸入不一致，請重新輸入", next);
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const updateUser = await User.findOneAndUpdate(
      { _id: userID },
      { password: hashPassword }
    );
    if (!updateUser) {
      return appError(400, "密碼更新錯誤", next);
    }

    handleSuccess(res, "更新密碼成功");
  },

  //登出----------------------------------------------------------------------------------
  //在User的 token 為空字串，代表使用者已經登出
  //在更新使用者資料時，我們要加上{ new: true }參數，表示要回傳更新後的使用者資料。最後，我們回傳成功訊息。
  async logout(req, res, next) {
    const userID = req.user;

    const logoutUser = await User.findByIdAndUpdate(
      userID,
      { token: "" },
      { new: true }
    );
    if (!logoutUser) {
      return appError(500, "資料庫更新錯誤", next);
    }

    handleSuccess(res, "您已登出系統");
  },
};

module.exports = user;
