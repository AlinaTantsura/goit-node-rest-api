import HttpError from "../helpers/HttpError.js";

import { Contacts } from "../models/contacts.js";



// export const getAllContacts = async (_, res, next) => {
//     try {
//         const data = await contactsService.listContacts();
//         res.status(200).json(data);
//     }
//     catch(error) {
//         next(error);
//     }
    
// };

// export const getOneContact = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const data = await contactsService.getContactById(id);
//         if (!data) {
//             throw HttpError(404)
//         }
//         res.status(200).json(data)
//     } catch (error) {
//         next(error);
//     }
// };

// export const deleteContact = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const data = await contactsService.removeContact(id);
//         if (!data) {
//             throw HttpError(404);
//         }
//         res.status(200).json(data);
//     } catch (error) {
//         next(error);
//     }
// };


// export const createContact = async (req, res, next) => {
//     try {
//         const { name, email, phone } = req.body;
//         const contact = await contactsService.addContact(name, email, phone);
//         res.status(201).json(contact)
//     } catch (error) {
//         next(error);
//     }
// };

// export const updateContact = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const data = await contactsService.getContactById(id);
//         if (!data) {
//             throw HttpError(404)
//         };
//         const reqBody = req.body;
//         const hasOwnProp = reqBody.hasOwnProperty("name") || reqBody.hasOwnProperty("email") || reqBody.hasOwnProperty("phone")
//         if (!hasOwnProp) {
//             throw HttpError(400, "Body must have at least one field")
//         }
//         const { name, email, phone } = req.body;
//         const contact = await contactsService.updateContact(id, {name, email, phone});
//         res.status(200).json(contact)
//     }
//     catch(error) { 
//         next(error);
//     }
// };

export const getAllContacts = async (_, res) => {
    const data = await Contacts.find();
    res.status(200).json(data);
};
export const getOneContact = async (req, res) => {
        const { id } = req.params;
        const data = await Contacts.findById(id);
        if (!data) {
            throw HttpError(404)
        }
        res.status(200).json(data)
};

export const deleteContact = async (req, res) => {
        const { id } = req.params;
        const data = await Contacts.findByIdAndDelete({_id: id});
        if (!data) {
            throw HttpError(404);
        }
        res.status(200).json(data);
};


export const createContact = async (req, res) => {
        const contact = await Contacts.create(req.body);
        res.status(201).json(contact)
};

export const updateContact = async (req, res) => {
        const { id } = req.params;
        // const data = await Contacts.findByIdAndUpdate({_id: id}, fields, {new: true});
        // if (!data) {
        //     throw HttpError(404)
        // };
        // const reqBody = req.body;
        // const hasOwnProp = reqBody.hasOwnProperty("name") || reqBody.hasOwnProperty("email") || reqBody.hasOwnProperty("phone")
        // if (!hasOwnProp) {
        //     throw HttpError(400, "Body must have at least one field")
        // }
        // const { name, email, phone } = req.body;
        const contact = await Contacts.findByIdAndUpdate({_id: id}, req.body, {new: true});
        res.status(200).json(contact)
};

export const updateStatusContact = async (req, res) => {
        const { id } = req.params;
    //     const data = await contactsService.getContactById(id);
    //     if (!data) {
    //         throw HttpError(404)
    //     };
    // const {favorite} = req.body;
    //     if (!favorite) {
    //         throw HttpError(400, "Body must have at least one field")
    // }
    const contact = await Contacts.findByIdAndUpdate({_id: id}, req.body, {new: true});
    res.status(200).json(contact);
    
}