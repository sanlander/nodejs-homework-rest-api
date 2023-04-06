const {
  getAllContacts,
  getContactById,
  createContact,
  removeContact,
  updateContacts,
  getTotalContacts,
} = require("../service/metods/contactsMetods");

const getAll = async (req, res, next) => {
  const { favorite, page, limit } = req.query;

  const paginationPage = +page || 1;
  const paginationlimit = +limit || 20;
  const skip = (paginationPage - 1) * paginationlimit;

  try {
    const totalContacts = await getTotalContacts();
    const contacts = await getAllContacts(favorite, skip, paginationlimit);

    res.json({ totalContacts, contacts, status: "success" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);

    if (!contact) res.status(404).json({ message: "Not found" });

    res.json({ contact, status: "success" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const create = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  const owner = req.user;

  try {
    if (!name || !email || !phone)
      res.status(400).json({ message: "missing required name field" });
    console.log(typeof ownerId);
    const contact = {
      name,
      email,
      phone,
      favorite,
      owner,
    };

    const newContact = await createContact(contact);

    res.status(201).json({ newContact, status: "success" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await removeContact(contactId);

    if (!contact) res.status(404).json({ message: "Not found" });

    res.json({ contact, message: "contact deleted", status: "success" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const keys = Object.keys(body);
  const bodyUpd = {};

  for (const key of keys) {
    if (key === "name" || key === "email" || key === "phone") {
      bodyUpd[key] = body[key];
    }
  }

  if (Object.keys(bodyUpd).length === 0) {
    return res
      .status(400)
      .json({ message: "missing fields or correct fields" });
  }

  try {
    const contact = await updateContacts(contactId, bodyUpd);

    if (!contact) res.status(404).json({ message: "Not found" });

    res.json({ contact, status: "success" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateStatus = async (req, res, next) => {
  const { contactId } = req.params;

  if (Object.keys(req.body).length === 0)
    return res.status(400).json({ message: "missing field favorite" });

  const { favorite } = req.body;

  try {
    const contact = await updateContacts(contactId, { favorite });

    if (!contact) res.status(404).json({ message: "Not found" });

    res.json({ contact, status: "success" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

module.exports = {
  getAll,
  getById,
  remove,
  create,
  update,
  updateStatus,
};
