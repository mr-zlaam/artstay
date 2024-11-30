import { ENV, HOST_EMAIL } from "../configs/config.js";
import type { ICOOKIEOPTIONS } from "../types/types.js";

export default {
  COMPANY_NAME: "Artstay",
  DEFAULT_ENDPOINT: "/api/v1",
  EMAILS: {
    WHITE_LIST_EMAILS: ["zlaam.dev@gmail.com"],
    APP_EMAIL: HOST_EMAIL
  },
  COOKIEOPTIONS: {
    ACESSTOKENCOOKIEOPTIONS: {
      httpOnly: true,
      secure: ENV === "production",
      sameSite: "none",
      expires: new Date(Date.now() + 14 * 60 * 1000) // 14 minutes in milliseconds
    } as ICOOKIEOPTIONS,
    REFRESHTOKENCOOKIEOPTIONS: {
      httpOnly: true,
      secure: ENV === "production",
      sameSite: "none",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days in milliseconds
    } as ICOOKIEOPTIONS
  }
};
