const express = require("express");
const controllers = require("../../controllers/auth-controllers");
const router = express.Router();
const { validateBody } = require("../../utils");
const { schemas } = require("../../models/user");
const { authenticate } = require("../../middlewares/index");

router.post(
    "/register",
    validateBody(schemas.registerSchema),
    controllers.register
);

router.post("/login", validateBody(schemas.loginSchema), controllers.login);

router.get("/current", authenticate, controllers.getCurrent);

router.post("/logout", authenticate, controllers.logout);
module.exports = router;
