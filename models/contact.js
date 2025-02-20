const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../utils");
const { User } = require("./user");

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            // required: [true, "Set name for contact"],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);
const Contact = model("contact", contactSchema);

const addSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.reqired": `"missing required name field`,
    }),
    email: Joi.string().required().messages({
        "any.reqired": `"missing required email field`,
    }),
    phone: Joi.string().required().messages({
        "any.reqired": `"missing required phone field`,
    }),
    favorite: Joi.boolean(),
    owner: {
        type: Schema.Types.ObjectId,
        refs: "user",
    },
});

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const schemas = {
    addSchema,
    updateFavoriteSchema,
};

module.exports = {
    Contact,
    schemas,
};
