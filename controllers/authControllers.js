import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';
import { join } from "path";
import { rename } from "fs/promises";
import Jimp from "jimp";

import { Users } from "../models/users.js";
import { updateContact } from "./contactsControllers.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

const avatarPath = join(process.cwd(), "./", "public", "avatars");
const { BASE_URL } = process.env;

export const registerUser = async (req, res) => {
    const { password, email } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use")
    }
    const avatarURL = gravatar.url(email);
    const hashPass = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const newUser = await Users.create({ email, password: hashPass, avatarURL, verificationToken });
    
    await sendEmail({
        to: email,
        subject: 'Verify email',
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click here for the verification</a>`})
    
    res.status(201).json({
        "user": {
            "email": newUser.email,
            "subscription": newUser.subscription
        }
    });
};

export const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await Users.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }
    await Users.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
    res.status(200).json({
        message: 'Verification successful'
    })
};

export const verifyEmailRequest = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw HttpError(400, "missing required field email");
    };
    
    const user = await Users.findOne({ email });
    if (!user) {
        throw HttpError(404, `Email "${email}" doesn't register`);
    }
    else if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }
    await sendEmail({
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click here for the verification</a>`})

    res.status(200).json({
        "message": "Verification email sent"
    })

}
export const loginUser = async (req, res) => {
    const { password, email } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    };

    if (!user.verify) {
        throw HttpError(401, "Email is not verified");
    }
    const isCorrectPass = await bcrypt.compare(password, user.password);

    if (!isCorrectPass) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = { id: user.id };
    const { SECRET_KEY } = process.env;
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' })
    await Users.findByIdAndUpdate(user._id, {token})
    res.status(200).json({
        "token": token,
        "user": {
            "email": user.email,
            "subscription": user.subscription
        }
    })

};

export const logoutUser = async (req, res) => {
    const { _id } = req.user;
    await Users.findByIdAndUpdate(_id, { token: null});

    res.status(204).json();
}

export const getUserByToken = async (req, res) => {
    const { email, subscription } = req.user;
    res.status(200).json({
        "email": email,
        "subscription": subscription
    });
};

export const updateUserSubscription = async (req, res) => {
    const { _id } = req.user;
    const updatedUser = await Users.findByIdAndUpdate(_id, req.body, { new: true });
    if (!updateContact) {
        throw HttpError(404);
    }
    res.status(200).json(updatedUser);

};

export const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    console.log(req.file)
    if (!req.file) {
        throw HttpError(400, "There is no file in request")
    }
    const { path: tempUpload, originalname } = req.file;
    const image = await Jimp.read(tempUpload);
    image.resize(250, 250);
    image.write(tempUpload);

    const filename = `${_id}_${originalname}`
    const resultUpload = join(avatarPath, filename);
    await rename(tempUpload, resultUpload);
    const avatarURL = join("avatars", filename);
    await Users.findByIdAndUpdate(_id, { avatarURL });

    res.json({
        avatarURL
    })
}