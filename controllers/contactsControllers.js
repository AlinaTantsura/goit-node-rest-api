import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    res.json({
        status: 'success',
        code: 200,
        data: await contactsService.listContacts()
    });
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;
    const data = await contactsService.getContactById(id);
    if (!data) {
        res.json({
        status: 'No content',
        code: 204,
        data: "ID isn't found"
    })
    }
    else {
        res.json({
        status: 'success',
        code: 200,
        data
    })
    }
    
};

export const deleteContact = async (req, res) => {
    const { id } = req.params;
    const data = await contactsService.removeContact(id);
    if (!data) res.json({ status: 'No content', code: 204, data: "ID isn't found" })
    else{ res.status(204).json() }
    
};

export const createContact = async (req, res) => {
    const { name, email, phone } = req.body;
    const contact = await contactsService.addContact(name, email, phone);
    res.status(201).json({
        status: 'success',
        code: 201,
        data: contact
    })
};

export const updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const contact = await contactsService.updateContact(id, {name, email, phone});
    res.json({
        status: 'success',
        code: 200,
        data: contact
    })
};