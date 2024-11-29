import status from "http-status";

const messages = {
  ERRMSG: "Something went wrong",
  SUCCESSMSG: "Operation was successful",
  NOTFOUNDMSG: "Not Found",
  BADREQUESTMSG: "Bad Request",
  UNAUTHORIZEDMSG: "Unauthorized",
  FORBIDDENMSG: "Forbidden",
  INTERNALSERVERERRORMSG: "Internal Server Error",
  TOOMANYREQUESTSMSG: "Too Many Requests. Please try again after",
  OTPALREADYSENT: "OTP already sent. Please try again after 1 minute"
};
export const {
  ERRMSG,
  SUCCESSMSG,
  NOTFOUNDMSG,
  TOOMANYREQUESTSMSG,
  BADREQUESTMSG,
  UNAUTHORIZEDMSG,
  FORBIDDENMSG,
  INTERNALSERVERERRORMSG,
  OTPALREADYSENT
} = messages;

// CODES
const statusCodes = {
  SUCCESSCODE: status.OK,
  CREATEDCODE: status.CREATED,
  BADREQUESTCODE: status.BAD_REQUEST,
  UNAUTHORIZEDCODE: status.UNAUTHORIZED,
  FORBIDDENCODE: status.FORBIDDEN,
  NOTFOUNDCODE: status.NOT_FOUND,
  INTERNALSERVERERRORCODE: status.INTERNAL_SERVER_ERROR,
  TOOMANYREQUESTSCODE: status.TOO_MANY_REQUESTS
};
export const {
  SUCCESSCODE,
  TOOMANYREQUESTSCODE,
  CREATEDCODE,
  BADREQUESTCODE,
  UNAUTHORIZEDCODE,
  FORBIDDENCODE,
  NOTFOUNDCODE,
  INTERNALSERVERERRORCODE
} = statusCodes;

const ENDPOINTS = {
  DEFAULTENDPOINT: "/api/v1"
};
export const { DEFAULTENDPOINT } = ENDPOINTS;
