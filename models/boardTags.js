const mongoose = require("mongoose");
const BoardtagSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "board" },
  createUser: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: [true, "使用者id未填寫"],
  },
});

const Boardtag = mongoose.model("boardtags", BoardtagSchema);

module.exports = Boardtag;
