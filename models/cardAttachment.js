const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: [true, "can not be empty!"],
  },
  fileName: {
    type: String,
    required: [true, "can not be empty!"],
  },
  filePath: {
    type: String,
    required: [true, "can not be empty!"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "使用者id未填寫"],
  },
  card: {
    type: mongoose.Schema.ObjectId,
    ref: "card",
    require: [true, "必填所屬卡片ID"],
  },
});
attachmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email avatar id createdAt",
  });

  next();
});
const Attachment = mongoose.model("Attachment", attachmentSchema);

module.exports = Attachment;
