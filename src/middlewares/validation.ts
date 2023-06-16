import { body, validationResult } from "express-validator";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../util/types";

const isValid = (req: Request, res: Response, next: NextFunction) => {
  const valError = validationResult(req);
  if (!valError.isEmpty()) {
    const error: CustomError = new Error("validation failed !!!");
    error.statusCode = 422;
    error.data = valError.array();
    throw error;
  }
  next();
};

export const validateLogin = [
  body("email", "Please enter a valid email !").isEmail().normalizeEmail(),
  body("password", "Password should have a minimum of 6 chars !")
    .trim()
    .isLength({ min: 8 }),
  isValid,
];

export const validateSignup = [
  body("name", "Name is required").trim().notEmpty(),
  body("email", "Please enter a valid email.")
    .isEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value.toLowerCase() }).exec();
      if (user) return Promise.reject("Email address already exists!");
    })
    .normalizeEmail(),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    })
    .withMessage(
      "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("confirmPassword")
    .trim()
    .custom((value: any, { req }: any) => {
      if (value !== req.body.password)
        throw new Error("Passwords have to match !!!");
      return true;
    }),
  body("companyId", "Company Id is required").trim().notEmpty(),
  isValid,
];

export const validateAddCandidate = [
  body("firstName", "firstName is required and should be string")
    .trim()
    .notEmpty()
    .isString(),
  body("middleName", "middleName is required and should be string")
    .trim()
    .notEmpty()
    .isString(),
  body("lastName", "firstName is required and should be string")
    .trim()
    .notEmpty()
    .isString(),
  body("dateOfBirth", "dateOfBirth is required").trim().notEmpty(),
  body("zip").isPostalCode("IN"),
  body("driverLicense").trim().notEmpty(),
  body("priorDriverLicense").trim().notEmpty(),
  body("phoneNumber").isMobilePhone("en-IN"),
  body("email", "Please enter a valid email !")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("companyId", "Company Id is required").trim().notEmpty(),
  isValid,
];

export const validateAddCourtSearch = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["clear", "considered"])
    .withMessage("Invalid status"),
  body("location", "location is required").trim().notEmpty(),
  body("violation", "violation is required").trim().notEmpty(),
  body("reportedDate", "Report Date is required").trim().notEmpty(),
  body("candidateId", "Candidate Id is required").trim().notEmpty(),
  isValid,
];

export const validateSendAdverseAction = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "scheduled", "dispute", "canceled", "undeliverable"])
    .withMessage("Invalid status"),
  body("preNotice", "preNotice is required").trim().notEmpty(),
  body("postNoticeSentOn", "postNoticeSentOn is required").trim().notEmpty(),
  body("candidateId", "Candidate Id is required").trim().notEmpty(),
  isValid,
];
export const validateAddReport = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["clear", "considered"])
    .withMessage("Invalid status"),
  body("adjudication")
    .notEmpty()
    .withMessage("Adjudication is required")
    .isIn(["engaged", "pre adverse action"])
    .withMessage("invalid Adjudication"),
  body("packAge").notEmpty().withMessage("Package is required"),
  body("completedAt").notEmpty().withMessage("CompletedAt is required"),
  body("EstimatedCompletionTime")
    .notEmpty()
    .withMessage("EstimatedCompletionTime is required"),
  body("candidateId").notEmpty().withMessage("CandidateId is required"),
  isValid,
];
