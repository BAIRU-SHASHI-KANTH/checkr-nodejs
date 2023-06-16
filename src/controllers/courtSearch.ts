import { NextFunction, Request, Response } from "express";
import { ICourtSearch, CustomError } from "../util/types";
import CourtSearch from "../models/courtSearch";
import Candidate from "../models/candidate";
const { RESPONSE_MESSAGES } = require("../util/constants");

export const getCourtSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const candidateId: string = req.params.candidateId;
    const courtSearches = await CourtSearch.find({ candidateId });
    if (!courtSearches || courtSearches.length === 0) {
      const error: CustomError = new Error(
        RESPONSE_MESSAGES.COURT_SEARCH_NOT_FOUND
      );
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: RESPONSE_MESSAGES.COURT_SEARCH_FOUND, courtSearches });
  } catch (error) {
    next(error);
  }
};

export const addCourtSearch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, location, violation, reportedDate, candidateId } = req.body;
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      const error: CustomError = new Error(
        RESPONSE_MESSAGES.CANDIDATE_NOT_FOUND
      );
      error.statusCode = 404;
      throw error;
    }

    const newCourtSearch: ICourtSearch = new CourtSearch({
      status,
      location,
      violation,
      reportedDate,
      candidateId,
    });

    const savedCourtSearch: ICourtSearch = await newCourtSearch.save();

    res.status(200).json({
      message: RESPONSE_MESSAGES.COURT_SEARCH_ADDED,
      courtSearch: savedCourtSearch,
    });
  } catch (error) {
    next(error);
  }
};
