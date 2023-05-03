const mongoose = require("mongoose");
const workSpaceSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: [true, "請輸入您的工作區名稱"],
    lowercase: true,
  },
  discribe: {
    type: String,
    default: "",
  },
  viewSet: {
    type: String,
    enum: ["private", "public"],
    default: "public",
  },
  isClose: {
    type: String,
    enum: ["Y", "N"],
    default: "N",
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
      },
      role: {
        type: String,
        enum: ["editor", "admin"],
      },
    },
  ],
  //   boards: [
  //     {
  //       boardId: {
  //         type: mongoose.Schema.ObjectId,
  //         ref: "user",
  //       },
  //     },
  //   ],
  creareUser: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "使用者id未填寫"],
  },
});
// WorkSpace
const WorkSpace = mongoose.model("workSpace", workSpaceSchema);

module.exports = WorkSpace;
