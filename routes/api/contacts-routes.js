const express = require("express");
const controllers = require("../../controllers/contacts-controllers");
const { validateBody } = require("../../utils");
const { schemas } = require("../../models/contact");
const { isValidId, authenticate } = require("../../middlewares/index");
const router = express.Router();

router.get("/", authenticate, controllers.getAllContacts);

router.get("/:contactId", authenticate, isValidId, controllers.getContactById);

router.post(
    "/",
    authenticate,
    validateBody(schemas.addSchema),
    controllers.addContact
);

router.put(
    "/:contactId",
    authenticate,
    isValidId,
    validateBody(schemas.addSchema),
    controllers.updateContact
);

router.patch(
    "/:contactId/favorite",
    authenticate,
    isValidId,
    validateBody(schemas.updateFavoriteSchema),
    controllers.updateFavoriteById
);

router.delete(
    "/:contactId",
    authenticate,
    isValidId,
    controllers.removeContact
);

module.exports = router;
