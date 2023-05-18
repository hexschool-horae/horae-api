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
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "card", default: [] }],
    board: { type: mongoose.Schema.Types.ObjectId, ref: "board" },
    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "使用者id未填寫"],
    },
  },
  { versionKey: "version" }
);

//定義虛擬 cardsInfo
ListSchema.virtual("cardsInfo", {
  ref: "card",
  localField: "cards",
  foreignField: "_id",
  justOne: false,
});

// List
const List = mongoose.model("list", ListSchema);

module.exports = List;
