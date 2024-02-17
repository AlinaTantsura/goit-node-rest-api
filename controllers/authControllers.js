import HttpError from "../helpers/HttpError.js";

import { Users } from "../models/users.js";

export const registerUser = async (req, res) => {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use")
    }

    const newUser = await Users.create(req.body);
    res.status(201).json({
        "user": {
            "email": newUser.email,
            "subscription": newUser.subscription
        }
    });
}