var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const errorHandler = require("./service/errorHandler");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
/** 生成 Swagger 套件 */
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json");

//router區塊
// var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var workSpaceRouter = require("./routes/workSpace");
var boardRouter = require("./routes/board");
var listRouter = require("./routes/list");
var cardRouter = require("./routes/card");
const uploadRouter = require("./routes/upload");

//express
var app = express();

//資料庫連線預設讀取index.js
require("./connections");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.use("/user", usersRouter);
app.use("/work-space", workSpaceRouter);
app.use("/board", boardRouter);
app.use("/list", listRouter);
app.use("/card", cardRouter);
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use("/upload", uploadRouter);
app.use(errorHandler); //環境變數指令切換Dev或Prod、客製錯誤訊息(要放在router下面)

process.on("uncaughtException", (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("uncaught Exception");
  console.error(err);
  process.exit();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕捉到的rejection:", promise, "原因:", reason);
});

module.exports = app;
