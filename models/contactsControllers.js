const fs = require("fs").promises;
const path = require("path");
const shortid = require("shortid");

const contactsPath = path.join(__dirname, `../models/contacts.json`);

const listContacts = async (req, res) => {
  try {
    const contactsString = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(contactsString);

    res.json({ contacts, status: "success" });
  } catch (error) {
    console.log("Errore");
  }
};

const getContactById = async (req, res) => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const [contact] = contacts.filter(
      (i) => Number(i.id) === Number(req.params.contactId)
    );

    if (!contact) res.status(404).json({ message: "Not found" });

    res.json({ contact, status: "success" });
  } catch (error) {
    console.error(error);
  }
};

const addContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone)
      res.status(400).json({ message: "missing required name field" });

    const newContact = {
      id: shortid(),
      name,
      email,
      phone,
    };

    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    contacts.push(newContact);

    res.status(201).json({ newContact, status: "success" });
  } catch (error) {
    console.error(error);
  }
};

const removeContact = async (req, res) => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    let contacts = JSON.parse(data);
    const [contact] = contacts.filter(
      (i) => Number(i.id) === Number(req.params.contactId)
    );

    if (!contact) res.status(404).json({ message: "Not found" });

    contacts = contacts.filter(
      (i) => Number(i.id) !== Number(req.params.contactId)
    );

    res.json({ message: "contact deleted", status: "success" });
  } catch (error) {
    console.error(error);
  }
};

const updateContact = async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);
    const bodyUpd = {};

    for (const key of keys) {
      if (key === "name" || key === "email" || key === "phone") {
        bodyUpd[key] = body[key];
      }
    }

    if (Object.keys(bodyUpd).length === 0)
      res.status(400).json({ message: "missing fields or correct fields" });

    const data = await fs.readFile(contactsPath, "utf-8");
    let contacts = JSON.parse(data);
    const [contact] = contacts.filter(
      (i) => Number(i.id) === Number(req.params.contactId)
    );

    if (!contact) res.status(404).json({ message: "Not found" });

    contacts = contacts.map((el) => {
      if (Number(el.id) === Number(req.params.contactId)) {
        const updContact = {
          ...el,
          ...bodyUpd,
        };
        res.json({ updContact, status: "success" });
        return updContact;
      }
      return el;
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
