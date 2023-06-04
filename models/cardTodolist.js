const mongoose = require("mongoose");

const todolistSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "內容不可空白"],
  },
  completed: {
    type: Boolean,
    required: [true, "必填"],
    default: false,
  },
  title: {
    type: mongoose.Schema.ObjectId,
    ref: "card",
    require: [true, "必填所屬卡片ID"],
  },
  card: {
    type: mongoose.Schema.ObjectId,
    ref: "card",
    require: [true, "必填所屬卡片ID"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todolist = mongoose.model("Todolist", todolistSchema);

module.exports = Todolist;
