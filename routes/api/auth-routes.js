const express = require("express");
const controllers = require("../../controllers/auth-controllers");
const router = express.Router();
const { validateBody } = require("../../utils");
const { schemas } = require("../../models/user");
const { authenticate, upload } = require("../../middlewares/index");

router.post(
    "/register",
    validateBody(schemas.registerSchema),
    controllers.register
);

router.post("/login", validateBody(schemas.loginSchema), controllers.login);

router.get("/current", authenticate, controllers.getCurrent);

router.get("/verify/:varificationCode", controllers.verify);
router.post(
    "/resend-verify-email",
    validateBody(schemas.emailSchema),
    controllers.resendVerifyEmail
);

router.post("/logout", authenticate, controllers.logout);
router.patch(
    "/avatars",
    authenticate,
    upload.single("avatar"),
    controllers.updateAvatar
);
module.exports = router;
