const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../schemas/usersSchema");

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

  if (!user || !user.verify) return null;

  const passwordIsValid = await user.chekPassword(password, user.password);

  user.password = undefined;

  if (!passwordIsValid) return null;

  return user;
};

const saveUserTokenInDB = async (id, token) => {
  return User.findOneAndUpdate({ _id: id }, { $set: { token } });
};

const deleteUserTokenInDB = async (id) => {
  await User.updateOne({ _id: id }, { $unset: { token: 1 } });
};

const updateUserAvatar = async (id, url) => {
  return User.findOneAndUpdate({ _id: id }, { $set: { avatarURL: `${url}` } });
};

const findUserByID = async (id) => {
  const user = await User.findById(id);

  return user;
};

const addResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return undefined;

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await User.findOneAndUpdate({_id: user.id}, user, { new: true });

  return { user, resetToken };
};

const checkResetToken = async (otp) => {
  const hashedToken = crypto.createHash("sha256").update(otp).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return undefined;

  return user;
};

const updateUserPasswordInDB = async (id, newPassword) => {
  await User.updateMany(
    { _id: id },
    {
      $set: { password: newPassword },
      $unset: { passwordResetToken: 1, passwordResetExpires: 1 },
    }
  );
};

const checkVerifyEmail = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });

  if (!user) return undefined;

  user.verificationToken = null;
  user.verify = true;

  await User.updateMany(
    { _id: user.id },
    {
      $set: { verificationToken: null, verify: true },
    }
  );

  return user;
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });

  return user;
};

module.exports = {
  createUser,
  existsEmail,
  checkUser,
  signToken,
  findUserByID,
  addResetToken,
  saveUserTokenInDB,
  deleteUserTokenInDB,
  updateUserAvatar,
  checkResetToken,
  updateUserPasswordInDB,
  checkVerifyEmail,
  findUserByEmail,
};
