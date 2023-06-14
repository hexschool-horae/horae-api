const multer = require("multer");
const path = require("path");
const appError = require("./appError");
const handleErrorAsync = require("./handleErrorAsync");
const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      cb(new Error("檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。"));
    }
    cb(null, true);
  },
}).any();

module.exports = upload;

// //檢查檔案的middleware
// const isOkFile = handleErrorAsync(async (req, res, next) => {
//   const reqParams = req.params;
//   console.log("reqParams", reqParams);

//   // if (listID.length < 15) {
//   //   return appError(400, "您的請求參數有誤", next);
//   // }
//   // const findList = await listModel.findById(listID);

//   // if (!findList || findList.length == 0) {
//   //   return appError(400, "查無此列表", next);
//   // }
//   // req.boardId = findList.boardId;
//   // console.log("req.boardId", findList.boardId);

//   next();
// });

// module.exports = {
//   isOkFile,
// };
