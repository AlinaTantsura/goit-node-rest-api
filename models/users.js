import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const userSchema = new Schema(
    {
        password: {
            type: String,
            min: 6,
            required: [true, 'Password is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ["starter", "pro", "business"],
            default: "starter"
        },
        token: {
            type: String,
            default: null,
        },
        avatarURL: {
            type: String,
            required: true,
        }
    },
    { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

export const Users = model("users", userSchema);

export const registerSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    subscription: Joi.string().valid("starter", "pro", "business")
});

export const loginSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
});

export const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required()
});