const mongoose = require("mongoose");
const ListSchema = new mongoose.Schema(
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

    status: {
      type: String,
      enum: ["open", "close"],
      default: "open",
      lowercase: true,
    },
    position: Number,
    cards: [{ type: mongoose.Schema.ObjectId, ref: "Card" }],
    board: { type: mongoose.Schema.ObjectId, ref: "Board" },
    creareUser: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "使用者id未填寫"],
    },
  },
  { versionKey: "version" }
);

// List
const List = mongoose.model("List", ListSchema);

module.exports = List;
