const mongoose = require("mongoose");
const BoardSchema = new mongoose.Schema({
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
  coverPath: {
    type: String,
    default: "",
  },
  viewSet: {
    type: String,
    enum: ["private", "public", "workspace"],
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
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "list", default: [] }],
  // workspace: { type: mongoose.Schema.ObjectId, ref: "workSpace", default: "" },
  createUser: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "使用者id未填寫"],
  },
});

// 定義虛擬 lists
BoardSchema.virtual("listsInfo", {
  ref: "list",
  localField: "lists",
  foreignField: "_id",
  justOne: false,
});

const Board = mongoose.model("board", BoardSchema);

module.exports = Board;
