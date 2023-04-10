const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const uuid = require("uuid").v4;

const { USER_ROLES_ENUM } = require("../constants/enums");
const {
  createUser,
  existsEmail,
  checkUser,
  signToken,
  saveUserTokenInDB,
  deleteUserTokenInDB,
  updateUserAvatar,
  addResetToken,
  checkResetToken,
  updateUserPasswordInDB,
  checkVerifyEmail,
  findUserByEmail,
} = require("../service/metods/usersMetods");
const { heshPasswords } = require("../utils/heshPasswords");
const Email = require("../service/email/email");

const register = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    if (await existsEmail(email))
      return res.status(409).json({ message: "Email in use" });

    const hashPassword = await heshPasswords(password);
    const verificationToken = uuid();
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/verify/${verificationToken}`;
    const avatarURL = `https:${gravatar.url(email, {
      s: "100",
      d: "wavatar",
    })}`;

    const user = {
      ...req.body,
      password: hashPassword,
      subscription: USER_ROLES_ENUM.STARTER,
      avatarURL,
      verificationToken,
    };

    const newUser = await createUser(user);

    newUser.password = undefined;

    await new Email(newUser, verificationUrl).sendVerify();

    res.status(201).json({
      user: {
        email,
        subscription: USER_ROLES_ENUM.STARTER,
        avatarURL,
        verificationUrl,
      },
      status: "success",
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await checkUser(email, password);

    if (!user)
      return res.status(401).json({ message: "Email or password is wrong" });

    const { id, subscription } = user;

    const token = signToken(id);

    await saveUserTokenInDB(id, token);

    res.status(200).json({
      token,
      user: {
        email,
        subscription,
      },
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

/*
Use after function "chekValidToken"
*/
const logout = async (req, res, next) => {
  try {
    const { id } = req.user;

    await deleteUserTokenInDB(id);

    res.status(204).json({ status: "success" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

/*
Use after function "chekValidToken"
*/
const current = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};

const avatar = async (req, res, next) => {
  const {
    user: { id },
    file,
  } = req;

  const oldPathToFile = path.join(file.path);
  const newPathToFile = path.join(process.cwd(), "public", "avatars");
  const extFile = file.mimetype.split("/")[1];
  const newAvatarURL = `${newPathToFile}/${id}.${extFile}`;

  const img = await Jimp.read(oldPathToFile);

  img.resize(250, 250).write(newAvatarURL);

  await updateUserAvatar(id, newAvatarURL);

  res.status(200).json({
    avatarURL: newAvatarURL,
  });
};

// PASSWORD RESTORE
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { user, resetToken } = await addResetToken(email);

    if (!user)
      return res
        .status(400)
        .json({ message: "There is no user with this email.." });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/reset-password/${resetToken}`;

await new Email(user, resetUrl).sendPasswordReset();
    
    res.status(200).json({ resetUrl });
  } catch (e) {
    console.error(e);

    next(e);
  }
};

// resetPassword;
const resetPassword = async (req, res, next) => {
  try {
    const otp = req.params.otp;
    const user = await checkResetToken(otp);

    if (!user) return res.status(400).json({ message: "Token is invalid.." });

    const hashNewPassword = await heshPasswords(req.body.password);

    await updateUserPasswordInDB(user.id, hashNewPassword);
    user.password = undefined;

    res.status(200).json({
      user,
    });
  } catch (e) {
    console.error(e);

    next(e);
  }
};

const verifyByToken = async (req, res, next) => {
  try {
    const verificationToken = req.params.verificationToken;

    const user = await checkVerifyEmail(verificationToken);

    if (!user) return res.status(404).json({ message: "User not found.." });

    res.status(200).json({
      message: "Verification successful",
      user,
    });
  } catch (e) {
    console.error(e);

    next(e);
  }
};

const verifyByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ message: "missing required field email.." });

    const user = await findUserByEmail(email);

    if (user.verify)
      return res
        .status(400)
        .json({ message: "Verification has already been passed.." });

    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/verify/${user.verificationToken}`;
    
    await new Email(user, verificationUrl).sendVerify();

    res.status(200).json({
      message: "Verification email sent again",
      verificationUrl,
    });
  } catch (e) {
    console.error(e);

    next(e);
  }
};

module.exports = {
  register,
  login,
  logout,
  current,
  avatar,
  forgotPassword,
  resetPassword,
  verifyByToken,
  verifyByEmail,
};
