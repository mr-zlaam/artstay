import { Router } from "express";
import AuthController from "../../controllers/authController/authController.js";
import { validate } from "../../middleware/validateMiddleware.js";
import { userRegistrationSchema } from "../../validations/authValidate.js";

export const authRouter: Router = Router();
// ** Register the user
authRouter.route("/register").post(validate(userRegistrationSchema), AuthController.register);
