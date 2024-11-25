import type { Request, Response, NextFunction } from "express";
import { type z } from "zod";
export declare function validateDataMiddleware(schema: z.AnyZodObject): (req: Request, res: Response, next: NextFunction) => void;
