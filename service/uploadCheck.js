const multer = require("multer");
const path = require("path");

const isOkFile = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (
      ext !== ".jpg" &&
      ext !== ".png" &&
      ext !== ".jpeg" &&
      ext !== ".doc" &&
      ext !== ".docx" &&
      ext !== ".pdf" &&
      ext !== ".xls" &&
      ext !== ".xlsx"
    ) {
      // return appError(400, "檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。");

      cb(new Error("檔案格式錯誤，僅限上傳圖片、doc、pdf 與 xls 格式。"));
    }
    cb(null, true);
  },
}).any();

const isOkImage = multer({
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

module.exports = {
  isOkImage,
  isOkFile,
};
