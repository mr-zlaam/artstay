import type { Request, Response, NextFunction } from "express";
import { type z, ZodError } from "zod";
import { BADREQUESTCODE, INTERNALSERVERERRORCODE, INTERNALSERVERERRORMSG } from "../constants/constant.js";

export function validateDataMiddleware(schema: z.AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: issueParamType) => ({
          message: `${issue.message}`
        }));
        res.status(BADREQUESTCODE).json({
          success: false,
          status: BADREQUESTCODE,
          error: "Invalid data",
          details: errorMessages
        });
      } else {
        res.status(INTERNALSERVERERRORCODE).json({
          success: false,
          status: INTERNALSERVERERRORCODE,
          error: INTERNALSERVERERRORMSG
        });
      }
    }
  };
}

type issueParamType = {
  message: string;
};
