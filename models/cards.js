const mongoose = require("mongoose");
const CardSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: [true, "請輸入您的列表名稱"],
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
    position: Number,
    list: { type: mongoose.Schema.ObjectId, ref: "List" },
    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "使用者id未填寫"],
    },
  },
  { versionKey: "version" }
);

// Card
const Card = mongoose.model("List", CardSchema);

module.exports = Card;
