import { Router } from "express";
import AuthController from "../../controllers/authController/authController.js";
import { validate } from "../../middleware/validateMiddleware.js";
import { logInUserSchema, userRegistrationSchema } from "../../validations/authValidate.js";
import rateLimiterMiddleware from "../../middleware/ rateLimiterMiddleware.js";

export const authRouter: Router = Router();
// ** Register the user
authRouter.route("/register").post(validate(userRegistrationSchema), AuthController.register);
authRouter
  .route("/verifyAccount")
  .post((req, res, next) => rateLimiterMiddleware.handle(req, res, next, 2, undefined, undefined, 180), AuthController.verifyAccount);

authRouter
  .route("/login")
  .post(
    validate(logInUserSchema),
    (req, res, next) => rateLimiterMiddleware.handle(req, res, next, 2, undefined, undefined, 960),
    AuthController.login
  );
