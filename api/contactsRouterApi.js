const express = require("express");
const router = new express.Router();

const {
  addPostValidation,
  addPutValidation,
} = require("../middlewares/validationContacts");

const {
  getAll,
  getById,
  remove,
  create,
  update,
  updateStatus,
} = require("../models/contactsControllers");

router.get("/", getAll);
router.get("/:contactId", getById);
router.post("/", addPostValidation, create);
router.delete("/:contactId", remove);
router.put("/:contactId", addPutValidation, update);
router.patch("/:contactId/status", updateStatus);

module.exports = router;
