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
    const userID = req.user;
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
    const findUser = await User.findOne({ _id: userID }).select(
      "+email +password"
    );
    //console.log("findUser.email", findUser.email);
    if (findUser.email != email.toLowerCase()) {
      return appError(400, "您不是輸入當初註冊的email", next);
    }

    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword || !findUser) {
      return appError(400, "您輸入的密碼錯誤", next);
    }

    generateSendJWT(findUser, 200, res);
  },
};

module.exports = user;
