import { NextFunction, Request, Response } from "express";
import { CustomError } from "../util/types";
import Report from "../models/report";
import Candidate from "../models/candidate";
const { RESPONSE_MESSAGES } = require("../util/constants");

export const getReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const candidateId: string = req.params.candidateId;
    const reports = await Report.find({ candidateId });
    if (!reports || reports.length === 0) {
      const error: CustomError = new Error(RESPONSE_MESSAGES.REPORT_NOT_FOUND);
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: RESPONSE_MESSAGES.REPORT_FOUND, reports });
  } catch (error) {
    next(error);
  }
};

export const addReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      status,
      adjudication,
      packAge,
      completedAt,
      EstimatedCompletionTime,
      candidateId,
    } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      const error: CustomError = new Error(
        RESPONSE_MESSAGES.CANDIDATE_NOT_FOUND
      );
      error.statusCode = 404;
      throw error;
    }

    const newReport = new Report({
      status,
      adjudication,
      package: packAge,
      completedAt,
      EstimatedCompletionTime,
      candidateId,
    });

    const savedReport = await newReport.save();

    candidate.report = savedReport._id;
    await candidate.save();

    res.status(200).json({
      message: RESPONSE_MESSAGES.REPORT_ADDED,
      report: savedReport,
    });
  } catch (error) {
    next(error);
  }
};
