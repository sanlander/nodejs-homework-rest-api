const { USER_ROLES_ENUM } = require("../constants/enums");
const {
  createUser,
  existsEmail,
  checkUser,
  signToken,
  updateUser,
} = require("../service/usersMetods");
const { heshPasswords } = require("../utils/heshPasswords");

const register = async (req, res, next) => {
  const { password, email } = req.body;

  if (await existsEmail(email))
    return res.status(409).json({ message: "Email in use" });

  const hashPassword = await heshPasswords(password);

  const user = {
    ...req.body,
    password: hashPassword,
    subscription: USER_ROLES_ENUM.STARTER,
  };

  try {
    const newUser = await createUser(user);

    newUser.password = undefined;

    res.status(201).json({
      user: {
        email: email,
        subscription: USER_ROLES_ENUM.STARTER,
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

    await updateUser(id, token);

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
  const { id } = req.user;

  try {
    await updateUser(id);

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

module.exports = {
  register,
  login,
  logout,
  current,
};
