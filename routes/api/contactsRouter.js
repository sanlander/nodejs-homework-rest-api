const express = require("express");
const router = new express.Router();

const {
  addPostValidation,
  addPutValidation,
} = require("../../middlewares/validationContacts");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contactsControllers");

router.get("/", listContacts);

router.get("/:contactId", getContactById);

router.post("/", addPostValidation, addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", addPutValidation, updateContact);

module.exports = router;
