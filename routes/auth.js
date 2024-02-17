import express from "express";
import { validateBody } from "../helpers/validateBody.js";
import { registerSchema } from "../models/users.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { registerUser } from "../controllers/authControllers.js";

export const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), ctrlWrapper(registerUser));
authRouter.post("/login");
authRouter.post("/logout");
authRouter.get("/current");