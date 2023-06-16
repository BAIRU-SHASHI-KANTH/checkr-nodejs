import winston from "winston";
const dotenv = require("dotenv");
dotenv.config();

const logger = winston.createLogger({
  level: process.env.log_level ?? "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
  ],
});

export default logger;
