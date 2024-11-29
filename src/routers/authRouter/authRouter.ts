import { Router } from "express";
import AuthController from "../../controllers/authController/authController.js";

const authRouter = Router();
authRouter.route("/auth/register").post(AuthController.register);
