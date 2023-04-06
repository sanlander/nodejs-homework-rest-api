const express = require("express");
const router = new express.Router();

const {
  addNewUserValidateJoi,
  loginValidateJoi,
} = require("../middlewares/validationUsers");

const {
  register,
  login,
  logout,
  current,
  avatar,
} = require("../models/authControllers");
const { chekValidToken } = require("../middlewares/chekValidToken");
const { uploadUserAvatar } = require("../middlewares/multerMiddleware");

router.post("/register", addNewUserValidateJoi, register);
router.post("/login", loginValidateJoi, login);

router.use(chekValidToken);

router.post("/logout", logout);
router.get("/current", current);
router.patch("/avatars", uploadUserAvatar, avatar);

module.exports = router;
