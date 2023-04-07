const jwt = require("jsonwebtoken");
const { findUserByID } = require("../service/metods/usersMetods");

const chekValidToken = async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];
  try {
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await findUserByID(decodedToken.id);
    if (!currentUser)
      return res.status(401).json({ message: "Not authorized" });

    req.user = currentUser;
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  chekValidToken,
};
