import { db } from "../../databases/database.js";
import type { IREGISTER, IVERIFY } from "../../types/types.js";
import reshttp from "reshttp";
import { httpResponse } from "../../utils/apiResponseUtils.js";
import { asyncHandler } from "../../utils/asyncHandlerUtils.js";
import { passwordHasher, verifyPassword } from "../../utils/passwordHasherUtils.js";
import constant from "../../constants/constant.js";
import { gloabalEmailMessage } from "../../services/globalEmailMessageService.js";
import { generateOtp } from "../../utils/slugStringGeneratorUtils.js";
import { messageSender } from "../../utils/messageSenderUtils.js";
import { filterAdmin } from "../../utils/FilterAdminUtils.js";
import tokenGeneratorUtils from "../../utils/tokenGeneratorUtils.js";
import { payloadGenerator } from "../../utils/payLoadGeneratorUtils.js";
import logger from "../../utils/loggerUtils.js";
export default class AuthController {
  // Register a new user and white list the verification part if user is  superadmin
  static register = asyncHandler(async (req, res) => {
    const body = req.body as IREGISTER;
    // ** validation is already handled by  middleware
    const user = await db.user.findFirst({ where: { username: body.username, email: body.email } });
    if (user) return httpResponse(req, res, reshttp.conflictCode, reshttp.conflictMessage);
    const OTPCODE = generateOtp(8);
    const hashedOTP = (await passwordHasher(OTPCODE.otp, res)) as string;
    const hashedPassword = (await passwordHasher(body.password, res)) as string;
    await db.user.create({
      data: {
        username: body.username,
        fullName: body.fullName,
        email: body.email,
        role: filterAdmin(body.email) ? "SUPERADMIN" : "CUSTOMER",
        password: hashedPassword,
        OTP: filterAdmin(body.email) ? null : hashedOTP,
        OTP_EXPIRES_IN: filterAdmin(body.email) ? null : OTPCODE.otpExpiry,
        isEmailVerified: filterAdmin(body.email) ? true : false
      }
    });
    if (!filterAdmin(body.email)) {
      await gloabalEmailMessage(
        constant.EMAILS.APP_EMAIL,
        body.email,
        undefined,
        messageSender(OTPCODE.otp).OTP_SENDER_MESSAGE,
        "Account Verification request",
        `Hi, ${body.fullName}`
      );
    }
    httpResponse(req, res, reshttp.createdCode, reshttp.createdMessage, {
      email: body.email,
      optionalMessage: filterAdmin(body.email) ? "Super Admin Registered Successfully" : "Please verify your account with OTP sent to your email."
    });
  });
  // ** Verify User Account through OTP
  static verifyAccount = asyncHandler(async (req, res) => {
    const { OTP, email } = req.body as IVERIFY;
    const user = await db.user.findUnique({ where: { email: email } });
    if (!user) throw { status: reshttp.notFoundCode, message: reshttp.notFoundMessage };
    if (user.OTP === null) {
      logger.warn("Account is already verified");
      throw { status: reshttp.conflictCode, message: reshttp.conflictMessage };
    }
    const verifyCredentials = await verifyPassword(OTP, user.OTP, res);
    if (!verifyCredentials) throw { status: reshttp.unauthorizedCode, message: reshttp.unauthorizedMessage };
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
