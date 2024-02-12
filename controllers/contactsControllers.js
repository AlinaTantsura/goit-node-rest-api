import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";



export const getAllContacts = async (_, res, next) => {
    try { 
        const data = await contactsService.listContacts();
        res.status(200).json(data);
    }
    catch(error) {
        next(error);
    }
    
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await contactsService.getContactById(id);
        if (!data) {
            throw HttpError(404)
        }
        res.status(200).json(data)
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await contactsService.removeContact(id);
        if (!data) {
            throw HttpError(404);
        }
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};


export const createContact = async (req, res, next) => {
    try {
        const { error } = createContactSchema.validate(req.body);
        if (error) {
            res.status(404).json(error.message);
            return;
        }
        const { name, email, phone } = req.body;
        const contact = await contactsService.addContact(name, email, phone);
        res.status(201).json(contact)
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = await contactsService.getContactById(id);
        if (!data) {
            throw HttpError(404)
        };
        const reqBody = req.body;
        if (!reqBody.hasOwnProperty("name" || "email" || "phone")) {
            res.status(400).json("Body must have at least one field");
            return;
        }
        const { error } = updateContactSchema.validate(req.body);
        if (error) {
            res.status(404).json(error.message);
            return;
        }
        const { name, email, phone } = req.body;
        const contact = await contactsService.updateContact(id, {name, email, phone});
        res.status(200).json(contact)
    }
    catch(error) { 
        next(error);
    }
};