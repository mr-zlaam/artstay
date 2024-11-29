import bcrypt from "bcrypt";
import type { Response } from "express";
import { jsonResponse } from "./apiResponseUtils.js";
import reshttp from "reshttp";
import logger from "./loggerUtils.js";

export const passwordHasher = async (password: string, res: Response) => {
  try {
    const hashedPassword: string = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error: unknown) {
    if (error instanceof Error)
      return res
        .status(reshttp.internalServerErrorCode)
        .json(jsonResponse(reshttp.internalServerErrorCode, error.message || reshttp.internalServerErrorMessage));
    else
      return res
        .status(reshttp.internalServerErrorCode)
        .json(jsonResponse(reshttp.internalServerErrorCode, (error as string) || "internal server error while hashing the password"));
  }
};
export const verifyPassword = async (password: string, existingPassword: string, res: Response): Promise<boolean | Response> => {
  try {
    const isPasswordValid = await bcrypt.compare(password, existingPassword);
    if (!isPasswordValid) {
      logger.error("password is not valid", { password, existingPassword });
      throw { status: reshttp.unauthorizedCode, message: reshttp.unauthorizedMessage };
    }
    return isPasswordValid;
  } catch (error: unknown) {
    logger.error("error while verifying password", { error });
    if (error instanceof Error)
      return res
        .status(reshttp.internalServerErrorCode)
        .json(jsonResponse(reshttp.internalServerErrorCode, error.message || reshttp.internalServerErrorMessage));
    return false;
  }
};
