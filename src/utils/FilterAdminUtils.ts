import constant from "../constants/constant.js";

export const filterAdmin = (email: string): boolean => {
  return constant.EMAILS.WHITE_LIST_EMAILS.includes(email);
};
