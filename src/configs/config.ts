import process from "node:process";
import DotenvFlow from "dotenv-flow";
type TENV = "development" | "production" | "test";
DotenvFlow.config();
const config = {
  PORT: process.env.PORT || 8001,
  ENV: process.env.NODE_ENV as TENV,
  JWT_SECRET: process.env.SECRET_KEY as string,
  HOST_EMAIL: process.env.HOST_EMAIL as string,
  HOST_EMAIL_SECRET: process.env.HOST_EMAIL_SECRET as string,
  FRONTEND_APP_URL: process.env.FRONTEND_APPLICATION_URL_DEV as string // TODO: change this env variable to  FRONTEND_APPLICATION_URL_PROD from FRONTEND_APPLICATION_URL_DEV
};
export const { PORT, ENV, JWT_SECRET, HOST_EMAIL, HOST_EMAIL_SECRET, FRONTEND_APP_URL } = config;
