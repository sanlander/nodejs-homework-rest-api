const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { USER_ROLES_ENUM } = require("../../constants/enums");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 3,
      maxlength: 70,
      select: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: false,
      lowercase: true,
    },
    subscription: {
      type: String,
      enum: Object.values(USER_ROLES_ENUM),
      default: USER_ROLES_ENUM.STARTER,
    },
    avatarURL: String,
    token: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { timestamps: true }
);

// Mongoose custom method
usersSchema.methods.chekPassword = (candidate, hash) =>
  bcrypt.compare(candidate, hash);

const User = mongoose.model("user", usersSchema);

module.exports = User;
