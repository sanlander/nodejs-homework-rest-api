const express = require("express");
const router = new express.Router();

const {
  addNewUserValidateJoi,
  loginValidateJoi,
  emailValidateJoi,
  passwordValidateJoi,
} = require("../middlewares/validationUsers");
const {
  register,
  login,
  logout,
  current,
  avatar,
  forgotPassword,
  resetPassword,
  verifyByEmail,
  verifyByToken,
} = require("../models/authControllers");
const { chekValidToken } = require("../middlewares/chekValidToken");
const { uploadUserAvatar } = require("../middlewares/multerMiddleware");

router.post("/register", addNewUserValidateJoi, register);
router.post("/login", loginValidateJoi, login);
router.post("/verify", emailValidateJoi, verifyByEmail);
router.get("/verify/:verificationToken", verifyByToken);

// PASSWORD RESTORE
// post req.body => user email => send one time password (OTP) by email // return void
router.post("/forgot-password", emailValidateJoi, forgotPassword);

// patch req.params (OTP) + req.body (new password) => update user in DB
router.patch("/reset-password/:otp", passwordValidateJoi, resetPassword);

router.use(chekValidToken);

router.post("/logout", logout);
router.get("/current", current);
router.patch("/avatars", uploadUserAvatar, avatar);

module.exports = router;