import HttpError from "../helpers/HttpError.js";

import { Contacts } from "../models/contacts.js";

export const getAllContacts = async (req, res) => {
        const { _id: owner } = req.user;
        const data = await Contacts.find({owner});
        res.status(200).json(data);
};
export const getOneContact = async (req, res) => {
        const { _id: owner } = req.user;
        const { id } = req.params;
        const data = await Contacts.findOne({owner, _id:id});
        // const data = await Contacts.findById(id);
        if (!data) {
            throw HttpError(404)
        }
        res.status(200).json(data)
};

export const deleteContact = async (req, res) => {
        const { _id: owner } = req.user;
        const { id } = req.params;
        const data = await Contacts.findOneAndDelete({owner, _id:id})
        // const data = await Contacts.findByIdAndDelete({_id: id});
        if (!data) {
            throw HttpError(404);
        }
        res.status(200).json(data);
};


export const createContact = async (req, res) => {
        const { _id: owner } = req.user;
        const contact = await Contacts.create({...req.body, owner});
        res.status(201).json(contact)
};

export const updateContact = async (req, res) => {
        const { _id: owner } = req.user;
        const { id } = req.params;
        const reqBody = req.body;
        const hasOwnProp = reqBody.hasOwnProperty("name") || reqBody.hasOwnProperty("email") || reqBody.hasOwnProperty("phone")
        if (!hasOwnProp) {
            throw HttpError(400, "Body must have at least one field")
        }
        const contact = await Contacts.findOneAndUpdate({owner, _id: id}, reqBody, {new: true});
        if (!contact) {
                throw HttpError(404)
        }
        res.status(200).json(contact)
};

export const updateStatusContact = async (req, res) => {
        const { id } = req.params;
        const contact = await Contacts.findByIdAndUpdate({_id: id}, req.body, {new: true});
        if (!contact) {
                throw HttpError(404)
        }
        res.status(200).json(contact);
}