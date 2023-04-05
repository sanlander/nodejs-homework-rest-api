const Contacts = require("./schemas/contactsSchema");

const getTotalContacts = async () => {
  return await Contacts.count();
};

const getAllContacts = async (query, skip, paginationlimit) => {
  const search = {};

  if (query === "true") {
    search.favorite = true;
  }

  return await Contacts.find(search).skip(skip).limit(paginationlimit);
};

const getContactById = async (id) => {
  return Contacts.findOne({ _id: id });
};

const createContact = async (contact) => {
  const { name, email, phone, favorite, owner } = contact;

  return Contacts.create({ name, email, phone, favorite, owner });
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
  getTotalContacts,
};
