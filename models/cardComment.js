const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "comment can not be empty!"],
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
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name id createdAt",
  });

  next();
});
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
