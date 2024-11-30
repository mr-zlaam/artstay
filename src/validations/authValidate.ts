import { z } from "zod";

export const userRegistrationSchema = z.object({
  username: z
    .string({ message: "username is required!!" })
    .min(3, {
      message: "Username must be at least 3 characters long. e.g: user123"
    })
    .max(50, { message: "Username can be at most 50 characters long. e.g: user123" })
    .regex(/^[a-z0-9_.]{1,20}$/, {
      message: "Username can only contain lowercase letters, numbers, underscores, and periods. e.g: user123"
    }),
  fullName: z
    .string({ message: "fullName is required!!" })
    .min(3, {
      message: "Full name must be at least 3 characters long. e.g: John Doe"
    })
    .max(50, { message: "Full name can be at most 50 characters long. e.g: John Doe" })
    .regex(/^[a-zA-Z ]{3,20}$/, {
      message: "Full name can only contain letters and spaces. e.g: John Doe"
    }),
  email: z
    .string({ message: "email is required!!" })
    .min(3, { message: "email must be at least 3 characters long." })
    .max(150, { message: "email can be at most 150 characters long." })
    .regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, {
      message: "Invalid email format. e.g: john.doe@example.com"
    }),
  password: z
    .string({ message: "password is required!!" })
    .min(6, { message: "password must be at least 6 characters long." })
    .max(50, { message: "password can be at most 50 characters long." })
});
