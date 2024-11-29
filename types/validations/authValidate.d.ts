import { z } from "zod";
export declare const registerSchema: z.ZodObject<
  {
    username: z.ZodString;
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    username: string;
    fullName: string;
    email: string;
    password: string;
  },
  {
    username: string;
    fullName: string;
    email: string;
    password: string;
  }
>;
