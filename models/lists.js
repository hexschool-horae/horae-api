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
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "board" },
    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "使用者id未填寫"],
    },
  },
  { versionKey: "version" }
);

//定義虛擬 boardInfo
ListSchema.virtual("boardInfo", {
  ref: "board",
  localField: "boardId",
  foreignField: "_id",
  justOne: true,
});

//定義虛擬 cardsInfo
ListSchema.virtual("cardsInfo", {
  ref: "card",
  localField: "cards",
  foreignField: "_id",
  justOne: false,
});

ListSchema.virtual("tagInfo", {
  ref: "boardtags",
  localField: "cards.tags",
  foreignField: "_id",
  justOne: false,
  options: { select: "title color" },
});

// List
const List = mongoose.model("list", ListSchema);

module.exports = List;
