const Contacts = require("./schemas/contactsSchema");

const getAllContacts = async () => {
  return Contacts.find();
};

const getContactById = async (id) => {
  return Contacts.findOne({ _id: id });
};

const createContact = async (name, email, phone, favorite) => {
  return Contacts.create({ name, email, phone, favorite });
};

const removeContact = (id) => {
  return Contacts.findByIdAndRemove({ _id: id });
};

const updateContacts = (id, fields) => {
  return Contacts.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  removeContact,
  updateContacts,
};
