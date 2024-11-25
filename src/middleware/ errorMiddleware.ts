import type { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ENV } from "../config/config.js";
interface CustomError extends Error {
  success?: boolean;
  status?: number;
}

export const notFoundHandler = (req: Request, __: Response, next: NextFunction) => {
  const error: CustomError = new Error(`This Route(${req.originalUrl}) doesn't exist on server`);
  error.status = 404;
  next(error);
};

export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const errObject = {
    success: false,
    statusCode: error.status || 500,
    message:
      error instanceof PrismaClientKnownRequestError
        ? "something went wrong while working with prisma!!"
        : error.message + "!!" || "internal server error!!",
    data: null,
    requestInfo: {
      url: req.originalUrl,
      method: req.method,
      ...(ENV !== "production" && { ip: req?.ip }) // Only add `ip` if not in production
    },
    ...(ENV !== "production" && { stack: error.stack ? error.stack : "No stack has been sent" }) // Only add `ip` if not in production
  };
  res
    .status(error.status || 500)
    .json(errObject)
    .end();
  next();
};
