const jwt = require("jsonwebtoken");
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const User = require("../models/users");

//檢查是否有權限的middleware
const isAuth = handleErrorAsync(async (req, res, next) => {
  //確認token是否存在
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(appError(400, "您尚未登入", next));
  }

  //驗證token的正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });

  //decoded.id回傳resolve(payload)
  const currentUser = await User.findById(decoded.id);
  req.user = currentUser;

  next();
});

//產生JWT並回傳
const generateSendJWT = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  user.password = undefined;
  res.status(statusCode).json({
    success: "true",
    user: { token: token },
    message: "成功",
  });
};

module.exports = { isAuth, generateSendJWT };
