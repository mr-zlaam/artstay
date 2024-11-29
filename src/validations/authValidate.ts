import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(20),
  fullName: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(20)
});
