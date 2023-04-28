const express = require("express");
const controllers = require("../../controllers/contacts-controllers");
const validateBody = require("../../utils/validateBody");
const { schema } = require("../../models/contact");

const router = express.Router();

router.get("/", controllers.getAllContacts);
router.get("/:contactId", controllers.getContactById);
router.post("/", validateBody(schema.addSchema), controllers.addContact);
router.put(
    "/:contactId",
    validateBody(schema.addSchema),
    controllers.updateContact
);
router.patch(
    "/:contactId/favorite",
    validateBody(schema.updateFavoriteSchema),
    controllers.updateFavoriteById
);
router.delete("/:contactId", controllers.removeContact);

module.exports = router;
