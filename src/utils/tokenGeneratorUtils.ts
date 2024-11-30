import type { Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/config.js";
import type { IPAYLOAD } from "../types/types.js";

export default {
  generateAccessToken: (payload: IPAYLOAD, res: Response, expiresIn?: string): string | Response => {
    try {
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn || "1d" });
      return token;
    } catch (error: unknown) {
      if (error instanceof Error)
        return res.status(500).json({
          success: false,
          message: error.message || "Internal server Error while generating access token",
          status: 500
        });
      else
        return res.status(500).json({
          success: false,
          message: (error as string) || "Internal server Error while generating access token",
          status: 500
        });
    }
  },
  generateRefreshToken: (payload: IPAYLOAD, res: Response, expiresIn?: string): string | Response => {
    try {
      const token = jwt.sign({ uid: payload.userID, tokenVersion: payload.tokenVersion }, JWT_SECRET, { expiresIn: expiresIn || "7d" });
      return token;
    } catch (error: unknown) {
      if (error instanceof Error)
        return res.status(500).json({
          success: false,
          message: error.message || "Internal server Error while generating access token",
          status: 500
        });
      else
        return res.status(500).json({
          success: false,
          message: (error as string) || "Internal server Error while generating access token",
          status: 500
        });
    }
  }
};
