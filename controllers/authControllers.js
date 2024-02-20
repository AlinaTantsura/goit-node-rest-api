import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import gravatar from 'gravatar';

import { Users } from "../models/users.js";
import { updateContact } from "./contactsControllers.js";

export const registerUser = async (req, res) => {
    const { password, email } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use")
    }
    // const avatarURL = gravatar.url(email);
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await Users.create({ email, password: hashPass, avatarURL });
    res.status(201).json({
        "user": {
            "email": newUser.email,
            "subscription": newUser.subscription
        }
    });
};

export const loginUser = async (req, res) => {
    const { password, email } = req.body;
    const user = await Users.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    };

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

}