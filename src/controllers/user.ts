import { NextFunction, Request, Response } from "express";
import { IUser, CustomError } from "../util/types";
import User from "../models/user";
const { RESPONSE_MESSAGES } = require("../util/constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users: IUser[] = await User.find();
    res.status(200).json({
      message: RESPONSE_MESSAGES.USERS_FOUND,
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, companyId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      companyId,
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: RESPONSE_MESSAGES.USER_REGISTERED_SUCCESSFULLY });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error: CustomError = new Error(
        RESPONSE_MESSAGES.INVALID_CREDENTIALS
      );
      error.statusCode = 401;
      throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      const error: CustomError = new Error(
        RESPONSE_MESSAGES.INVALID_CREDENTIALS
      );
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.secretText,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: RESPONSE_MESSAGES.USER_LOGIN_SUCCESS,
      token,
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};
