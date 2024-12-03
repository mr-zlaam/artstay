import { db } from "../../databases/database.js";
import type { IREGISTER } from "../../types/types.js";
import reshttp from "reshttp";
import { httpResponse } from "../../utils/apiResponseUtils.js";
import { asyncHandler } from "../../utils/asyncHandlerUtils.js";
import { passwordHasher } from "../../utils/passwordHasherUtils.js";
import constant from "../../constants/constant.js";
import { gloabalEmailMessage } from "../../services/globalEmailMessageService.js";
import { defineExpireyTime, generateRandomStrings } from "../../utils/slugStringGeneratorUtils.js";
import { messageSender } from "../../utils/messageSenderUtils.js";
import { filterAdmin } from "../../utils/FilterAdminUtils.js";
import tokenGeneratorUtils from "../../utils/tokenGeneratorUtils.js";
import { payloadGenerator } from "../../utils/payLoadGeneratorUtils.js";
import logger from "../../utils/loggerUtils.js";
import { FRONTEND_APP_URL } from "../../configs/config.js";
export default class AuthController {
  // Register a new user and white list the verification part if user is  superadmin
  static register = asyncHandler(async (req, res) => {
    const body = req.body as IREGISTER;
    // ** validation is already handled by  middleware
    const user = await db.user.findFirst({ where: { username: body.username, email: body.email } });
    if (user) return httpResponse(req, res, reshttp.conflictCode, reshttp.conflictMessage);
    const OTP_TOKEN = generateRandomStrings(40);
    const OTP_TOKEN_EXPIRES_IN = defineExpireyTime(4, "h");
    const hashedPassword = (await passwordHasher(body.password, res)) as string;
    await db.user.create({
      data: {
        username: body.username,
        fullName: body.fullName,
        email: body.email,
        role: filterAdmin(body.email) ? "SUPERADMIN" : "CUSTOMER",
        password: hashedPassword,
        OTP: filterAdmin(body.email) ? null : OTP_TOKEN,
        OTP_EXPIRES_IN: filterAdmin(body.email) ? null : OTP_TOKEN_EXPIRES_IN,
        isEmailVerified: filterAdmin(body.email) ? true : false
      }
    });
    if (!filterAdmin(body.email)) {
      await gloabalEmailMessage(
        constant.EMAILS.APP_EMAIL,
        body.email,
        undefined,
        messageSender(`${FRONTEND_APP_URL}/auth/verify?token=${OTP_TOKEN}`, "4h").OTP_SENDER_MESSAGE,
        "Account Verification request",
        `Hi, ${body.fullName}`
      );
    }
    httpResponse(req, res, reshttp.createdCode, reshttp.createdMessage, {
      email: body.email,
      optionalMessage: filterAdmin(body.email)
        ? "Super Admin Registered Successfully"
        : "Please verify your account with verification link sent to your email."
    });
  });
  // ** Verify User Account through OTP
  static verifyAccount = asyncHandler(async (req, res) => {
    const { token } = req.query;
    if (!token) throw { status: reshttp.badRequestCode, message: reshttp.badRequestMessage };
    const user = await db.user.findUnique({ where: { OTP: token as string } });
    if (!user) throw { status: reshttp.notFoundCode, message: reshttp.notFoundMessage };
    if (user.OTP === null) {
      logger.warn("Account is already verified");
      throw { status: reshttp.conflictCode, message: reshttp.conflictMessage };
    }
    // ** check if token is expired
    if (user.OTP_EXPIRES_IN && user.OTP_EXPIRES_IN < new Date()) {
      await db.user.update({
        where: { email: user.email },
        data: { OTP: null, OTP_EXPIRES_IN: null }
      });
      throw { status: reshttp.unauthorizedCode, message: "Verification link is already expired. Please try again" };
    }
    await db.user.update({
      where: { email: user.email },
      data: { isEmailVerified: true, OTP: null, OTP_EXPIRES_IN: null, tokenVersion: { increment: 1 } }
    });
    const { generateAccessToken, generateRefreshToken } = tokenGeneratorUtils;
    const payLoad = payloadGenerator({
      username: user.username,
      userID: user.userID,
      isVerified: true,
      tokenVersion: user.tokenVersion,
      role: user.role
    });
    const accessToken = generateAccessToken(payLoad, res);
    const refreshToken = generateRefreshToken(payLoad, res);
    res
      .cookie("refreshToken", refreshToken, constant.COOKIEOPTIONS.REFRESHTOKENCOOKIEOPTIONS)
      .cookie("accessToken", accessToken, constant.COOKIEOPTIONS.ACESSTOKENCOOKIEOPTIONS);
    httpResponse(req, res, reshttp.okCode, reshttp.okMessage, { message: "Account Verified Successfully", accessToken, refreshToken });
  });
}
