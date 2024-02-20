import express from "express";
import multer from "multer";
import { validateBody } from "../helpers/validateBody.js";
import { registerSchema, loginSchema, updateSubscriptionSchema } from "../models/users.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { registerUser, loginUser, logoutUser, getUserByToken, updateUserSubscription } from "../controllers/authControllers.js";
import { auth } from "../helpers/auth.js";
import {join} from "path"

export const authRouter = express.Router();

const tempDir = join(__dirname, 'temp');
const multerConfig = multer.diskStorage({
  destination: tempDir,
});

const upload = multer({
  storage: multerConfig,
})



authRouter.post("/register", validateBody(registerSchema), ctrlWrapper(registerUser));
authRouter.post("/login", validateBody(loginSchema), ctrlWrapper(loginUser));
authRouter.post("/logout", auth, ctrlWrapper(logoutUser));
authRouter.get("/current", auth, ctrlWrapper(getUserByToken));
authRouter.patch("/", auth, validateBody(updateSubscriptionSchema), ctrlWrapper(updateUserSubscription))