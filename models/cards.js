const mongoose = require("mongoose");
const CardSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: [true, "請輸入您的卡片名稱"],
    },
    describe: {
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
    startDate: {
      type: Number,
      default: null,
    },
    endDate: {
      type: Number,
      default: null,
    },
    members: [{ type: mongoose.Schema.ObjectId, ref: "user", default: [] }],
    //comments: [{ type: mongoose.Schema.ObjectId, ref: "comment", default: [] }],
    tags: [{ type: mongoose.Schema.ObjectId, ref: "boardtags", default: [] }],
    todolists: [
      { type: mongoose.Schema.ObjectId, ref: "todolist", default: [] },
    ],
    // dateSetting: [{ type: mongoose.Schema.ObjectId, ref: "dateSetting" }], 設定日期
    attachments: [
      { type: mongoose.Schema.ObjectId, ref: "attachment", default: [] },
    ],
    proiority: {
      type: String,
      enum: ["1", "2", "3", "4", ""],
      default: "",
    },
    coverPath: {
      type: String,
      default: "",
    },
    position: { type: Number, require: true },
    list: { type: mongoose.Schema.ObjectId, ref: "list" },
    boardId: { type: mongoose.Schema.ObjectId, ref: "board" },
    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "使用者id未填寫"],
    },
    updateAt: {
      type: Date,
      default: Date.now,
    },
    updateUser: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "使用者id未填寫"],
    },
  },
  {
    versionKey: "version",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CardSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "card",
  localField: "_id",
});

// Card
const Card = mongoose.model("card", CardSchema);

module.exports = Card;
