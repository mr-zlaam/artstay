import { Router } from "express";
import AuthController from "../../controllers/authController/authController.js";

export const authRouter: Router = Router();
authRouter.route("/register").post(AuthController.register);
