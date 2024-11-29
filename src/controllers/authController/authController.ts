import { db } from "../../databases/database.js";
import type { IREGISTER } from "../../types/types.js";
import reshttp from "reshttp";
import { httpResponse } from "../../utils/apiResponseUtils.js";
import { asyncHandler } from "../../utils/asyncHandlerUtils.js";
import { passwordHasher } from "../../utils/passwordHasherUtils.js";
import constant from "../../constants/constant.js";
import { gloabalEmailMessage } from "../../services/globalEmailMessageService.js";
import { generateOtp } from "../../utils/slugStringGeneratorUtils.js";
import { messageSender } from "../../utils/messageSenderUtils.js";
import { filterAdmin } from "../../utils/FilterAdminUtils.js";
export default class AuthController {
  static register = asyncHandler(async (req, res) => {
    const body = req.body as IREGISTER;
    // validation is already handled by  middleware
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
}
