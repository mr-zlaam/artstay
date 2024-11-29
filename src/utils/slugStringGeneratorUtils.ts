import crypto from "node:crypto";
export function generateRandomStrings(length: number) {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }
  return randomString;
}

export function generateSlug(slugString: string) {
  let slug = slugString.toLowerCase();
  slug = slug.replace(/[^a-z0-9\s-]/g, "");
  slug = slug.trim().replace(/\s+/g, "-");
  return slug;
}

export function generateOtp(length = 6, expiryUnit: "s" | "m" | "h" | "d" = "m", expiryValue = 30): { otp: string; otpExpiry: Date } {
  let otp = Array.from({ length }, () => crypto.randomInt(0, 10)).join("");
  otp = otp.padStart(length, "0");
  let expiryMilliseconds = expiryValue * 60 * 1000;
  if (expiryUnit === "h") expiryMilliseconds = expiryValue * 60 * 60 * 1000;
  if (expiryUnit === "s") expiryMilliseconds = expiryValue * 1000;
  if (expiryUnit === "d") expiryMilliseconds = expiryValue * 24 * 60 * 60 * 1000;

  const otpExpiry = new Date(Date.now() + expiryMilliseconds);

  return { otp, otpExpiry };
}
