const { controllersWrapper } = require("../utils");
const { Contact } = require("../models/contact");
const { HttpError } = require("../helpers");

const getAllContacts = async (req, res) => {
    const result = await Contact.find();
    res.status(200).json(result);
};

const getContactById = async (req, res) => {
    const { id } = req.params;
    // const result = await Contact.findOne({ _id: id });
    const result = await Contact.findById(id);
    if (!result) {
        throw HttpError(404);
    }
    res.status(200).json(result);
};

const addContact = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
        throw HttpError(404);
    }
    res.status(200).json(result);
};

const updateFavoriteById = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
        throw HttpError(404, `Contact with ${id} not found`);
    }
    res.json(result);
};

const removeContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.deleteContactById(id);
    if (!result) {
        throw HttpError(404);
    }
    res.json({
        message: "Delete success",
    });
};

module.exports = {
    getAllContacts: controllersWrapper(getAllContacts),
    getContactById: controllersWrapper(getContactById),
    addContact: controllersWrapper(addContact),
    updateContact: controllersWrapper(updateContact),
    updateFavoriteById: controllersWrapper(updateFavoriteById),
    removeContact: controllersWrapper(removeContact),
};
