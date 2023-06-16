import { Response, NextFunction } from "express";
import { CustomError } from "../util/types";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { RESPONSE_MESSAGES } = require("../util/constants");

export const isAuth = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error: CustomError = new Error(
      RESPONSE_MESSAGES.NOT_AUTHENTICATED_NO_TOKEN
    );
    error.statusCode = 401;
    throw error;
  }
  const token = req.get("Authorization")?.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.secretText);
  } catch (err) {
    next(err);
  }
  if (!decodedToken) {
    const error: CustomError = new Error(
      RESPONSE_MESSAGES.NOT_AUTHENTICATED_WRONG_TOKEN
    );
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;

  next();
};
