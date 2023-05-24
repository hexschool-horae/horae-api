//正式環境錯誤訊息
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: "dd" + err.message,
    });
  } else {
    // log 紀錄
    console.error("出現重大錯誤", err);
    // 送出罐頭預設訊息
    res.status(500).json({
      success: false,
      status: "error",
      message: "系統錯誤，請恰系統管理員",
    });
  }
};

//開發環境錯誤訊息
const resErrorDev = (err, res) => {
  console.log("err.isOperational", err.isOperational);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const errorHandle = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "dev") {
    resErrorDev(err, res);
  }
  //else if (process.env.NODE_ENV === "prod") {
  else {
    if (err.isAxiosError == true) {
      err.message = "axios 連線錯誤";
      err.isOperational = true;
      return resErrorProd(err, res);
    } else if (err.name === "ValidationError") {
      // mongoose 資料辨識錯誤
      err.isOperational = true;
      return resErrorProd(err, res);
    } else if (err.name === "SyntaxError") {
      err.statusCode = 400;
      err.isOperational = true;
      err.message = "資料格式錯誤";
    } else if (err.name === "TokenExpiredError") {
      err.statusCode = 401;
      err.isOperational = true;
      err.message = "您的驗證已過期，請重新登入";
    }

    resErrorProd(err, res);
  }
};

module.exports = errorHandle;
