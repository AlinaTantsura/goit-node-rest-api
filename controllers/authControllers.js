import HttpError from "../helpers/HttpError.js";
import bcrypt from "bcrypt";
import 'dotenv/config';
import jwt from 'jsonwebtoken'

import { Users } from "../models/users.js";

export const registerUser = async (req, res) => {
    const { password, email } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use")
    }
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await Users.create({ email, password: hashPass });
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

    res.status(200).json({
        "token": token,
        "user": {
            "email": user.email,
            "subscription": user.subscription
        }
    })

};

export const logoutUser = async (req, res) => {
    // const { authorization} = req.headers;
    // authorization = null;
    // res.status(204);
}

export const getUserByToken = async (req, res) => {
    const { email, subscription } = req.user;
    res.status(200).json({
        "email": email,
        "subscription": subscription
    });
}