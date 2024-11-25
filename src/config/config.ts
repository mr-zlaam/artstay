import process from "node:process";
import DotenvFlow from "dotenv-flow";
type TENV = "development" | "production" | "test";
DotenvFlow.config();
const config = {
  PORT: process.env.PORT || 3000,
  ENV: process.env.NODE_ENV as TENV
};
export const { PORT, ENV } = config;
