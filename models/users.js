const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: [true, "請輸入您的名字"],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "請輸入您的 Email"],
    unique: true,
    lowercase: true,
    select: false,
  },
  avatar: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: [true, "請輸入密碼"],
    minlength: 8,
    select: false,
  },
  googleId: {
    type: String,
    select: false,
  },
  emailVerify: {
    type: String,
    enum: ["Y", "N"],
    default: "N",
  },
  visitBoards: {
    type: Array,
    default: [],
  },
  token: { type: String, default: "" },
});
// User
const User = mongoose.model("user", userSchema);

module.exports = User;
