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
    lowercase: true,
  },
  status: {
    type: String,
    enum: ["open", "close"],
    default: "open",
    lowercase: true,
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
  inviteHashData: {
    type: String,
    default: "",
  },
  //   boards: [
  //     {
  //       boardId: {
  //         type: mongoose.Schema.ObjectId,
  //         ref: "user",
  //       },
  //     },
  //   ],
  boards: [{ type: mongoose.Schema.ObjectId, ref: "Board", default: "" }],
  createUser: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "使用者id未填寫"],
  },
});
// WorkSpace
const WorkSpace = mongoose.model("workSpace", workSpaceSchema);

module.exports = WorkSpace;
