import { db } from "../../databases/database.js";
import type { IREGISTER } from "../../types/types.js";
import reshttp from "reshttp";
import { httpResponse } from "../../utils/apiResponseUtils.js";
import { asyncHandler } from "../../utils/asyncHandlerUtils.js";
export default class AuthController {
  static register = asyncHandler(async (req, res) => {
    const { username, fullName, email, password } = req.body as IREGISTER;
    const user = await db.user.findFirst({ where: { username, email } });
    if (user) return httpResponse(req, res, reshttp.conflictCode, reshttp.conflictMessage);
    // validation is already handled by  middleware
    await db.user.create({ data: { username, fullName, email, password } });
    httpResponse(req, res, reshttp.createdCode, reshttp.createdMessage, { username, fullName, email });
  });
}
