const multer = require("multer");
const uuid = require("uuid").v4;

const multerStorage = multer.diskStorage({
  destination: (req, file, callBackFunc) => {
    callBackFunc(null, "tmp");
  },
  filename: (req, file, callBackFunc) => {
    const ext = file.mimetype.split("/")[1];
    callBackFunc(null, `${file.originalname}-${uuid()}.${ext}`);
  },
});

const multerFilter = (req, file, callBackFunc) => {
  if (file.mimetype.startsWith("image")) {
    callBackFunc(null, true);
  } else {
    callBackFunc(new Error("Please upload images only.."), false);
  }
};

const uploadUserAvatar = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single("avatar");

module.exports = {
  uploadUserAvatar,
};
