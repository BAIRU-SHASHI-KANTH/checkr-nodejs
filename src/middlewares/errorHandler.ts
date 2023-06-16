import { Request, Response, NextFunction } from "express";
import { CustomError } from "../util/types";

export const errorHandler = (
  error: CustomError,
  
  res: Response,
  req: Request,
  next: NextFunction
) => {
  const statusCode: number = error.statusCode ?? 500;
  const message: string = error.message;
  const data: any = error.data;
  res.status(statusCode).json({
    error: {
      message,
      data,
    },
  });
};
