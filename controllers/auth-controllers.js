const bcrypt = require("bcrypt");
const { controllersWrapper } = require("../utils");
const { User } = require("../models/user");
const { HttpError, sendEmail } = require("../helpers");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationCode = nanoid();

    const result = await User.create({
        ...req.body,
        password: hashPassword,
        avatarURL,
        verificationCode,
    });

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}"">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        name: result.name,
        email: result.email,
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password invalid");
    }
    if (!user.verify) {
        throw HttpError(401, "Email not verify");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
    });
};

const getCurrent = async (req, res) => {
    const { name, email } = req.user;

    res.json({
        name,
        email,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
        message: "Logout success",
    });
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    const avatarName = `${_id}_${filename}`;
    const resultUpload = path.join(avatarsDir, avatarName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", avatarName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
};

const verify = async (req, res) => {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });
    if (!user) {
        throw HttpError(404, "Email not found");
    }

    await User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationCode: "",
    });

    res.json({
        message: "Email verify success",
    });
};
const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, "Email not found");
    }
    if (user.verify) {
        throw HttpError(400, "Email already verify");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Email resend success",
    });
};

module.exports = {
    register: controllersWrapper(register),
    login: controllersWrapper(login),
    getCurrent: controllersWrapper(getCurrent),
    logout: controllersWrapper(logout),
    updateAvatar: controllersWrapper(updateAvatar),
    verify: controllersWrapper(verify),
    resendVerifyEmail: controllersWrapper(resendVerifyEmail),
};
