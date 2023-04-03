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
} = require("../models/authControllers");
const { chekValidToken } = require("../middlewares/chekValidToken");

router.post("/register", addNewUserValidateJoi, register);
router.post("/login", loginValidateJoi, login);

router.use(chekValidToken);

router.post("/logout", logout);
router.get("/current", current);

module.exports = router;
