import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    res.json(await contactsService.listContacts());
};

export const getOneContact = (req, res) => {};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};