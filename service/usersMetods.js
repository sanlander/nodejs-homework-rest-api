const jwt = require("jsonwebtoken");
const User = require("./schemas/usersSchema");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

const createUser = async (user) => {
  return await User.create(user);
};

const existsEmail = async (email) => {
  const userExests = await User.exists({ email });
  return userExests;
};

const checkUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) return null;

  const passwordIsValid = await user.chekPassword(password, user.password);

  user.password = undefined;

  if (!passwordIsValid) return null;

  return user;
};

const updateUser = (id, token = null) => {
  return User.findOneAndUpdate({ _id: id }, { $set: { token: `${token}` } });
};

const findUser = async (id) => {
  const user = await User.findById(id);
  return user;
};

module.exports = {
  createUser,
  existsEmail,
  checkUser,
  signToken,
  findUser,
  updateUser,
};
