import moment from "moment";
import winston from "winston";
import "winston-daily-rotate-file";
import { ENV } from "../configs/config.js";
import { red, yellow, green, magenta } from "colorette";
export const colorizeLevel = (level: string) => {
  if (level.includes("ERROR")) return red(level);
  else if (level.includes("INFO")) return green(level);
  else if (level.includes("WARN")) return yellow(level);
  else return magenta(level);
};
// File transport for rotating logs in development
const devFileTransport = new winston.transports.DailyRotateFile({
  filename: "logs/development-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d"
});

// File transport for rotating logs in production
const prodFileTransport = new winston.transports.DailyRotateFile({
  filename: "logs/production-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d"
});

// Console transport for development with colorized output
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.prettyPrint(), // Add color for the console in dev
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const customLevel = colorizeLevel(
        level.includes("error") ? "ERROR" : level.includes("info") ? "INFO" : level.includes("warn") ? "WARN" : "DEBUG"
      );
      const customLog = `
-------------------------------------------------------------------------------
  ${customLevel}::${message as string} 
  ${yellow("TIMESTAMP")}::${green(moment(timestamp as string).format("YYYY-MM-DD HH:mm:ss"))}
  ${magenta("META")}::${yellow(JSON.stringify(meta, null, 2))}
-------------------------------------------------------------------------------
`;

      return customLog;
    })
  )
});

// Determine the logging level based on NODE_ENV
const logLevel = ENV === "production" ? "warn" : "info";

// Logger setup
const logger = winston.createLogger({
  level: logLevel, // Use 'warn' for production, 'info' for development
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss" // Timestamp format
    }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `[${level}]: ${message as string} \n[time]: ${moment(timestamp as string).format("YYYY-MM-DD HH:mm:ss")} \nmeta: ${JSON.stringify(meta)}`;
    })
  ),
  transports: [
    consoleTransport, // Always log to the console
    // Use different file transports based on the environment
    ...(ENV === "production" ? [prodFileTransport] : [devFileTransport])
  ]
});

export default logger;
