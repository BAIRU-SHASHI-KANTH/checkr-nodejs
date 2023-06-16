import { NextFunction, Request, Response } from "express";
import { ICandidate, CustomError } from "../util/types";
import Candidate from "../models/candidate";
import Notice from "../models/notice";
import Report from "../models/report";
import { createNameFilter } from "../util/helper";
const { RESPONSE_MESSAGES, PAGINATION } = require("../util/constants");

export const getAllCandidates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adverseActions = req.query.adverseActions;

    let candidates: ICandidate[];

    if (adverseActions === "true") {
      candidates = await Candidate.find({ notice: { $exists: true } }).populate(
        "notice"
      );
      res.status(200).json({
        message: RESPONSE_MESSAGES.CANDIDATES_WITH_ADVERSE_ACTION,
        candidates: candidates,
      });
    } else {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        name = "",
        status = [],
        adjudication = [],
      } = req.query;

      let filter: any = {};
      if (name && typeof name === "string") {
        filter = createNameFilter(name);
      }
      if (Array.isArray(status) && status.length > 0 && status[0] !== "all") {
        const reportFilter: any = {};
        reportFilter.status = { $in: status };
        const reportIds = await Report.find(reportFilter, "_id").lean();
        filter.report = { $in: reportIds.map((report: any) => report._id) };
      }

      if (
        Array.isArray(adjudication) &&
        adjudication.length > 0 &&
        adjudication[0] !== "all"
      ) {
        const reportFilter: any = {};
        reportFilter.adjudication = { $in: adjudication };
        const reportIds = await Report.find(reportFilter, "_id").lean();
        filter.report = { $in: reportIds.map((report: any) => report._id) };
      }

      const skip = (parseInt(page.toString()) - 1) * parseInt(limit.toString());

      candidates = await Candidate.find(filter)
        .skip(skip)
        .limit(parseInt(limit.toString()))
        .populate("report");

      if (candidates.length === 0) {
        const error: CustomError = new Error(
          RESPONSE_MESSAGES.CANDIDATES_NOT_FOUND
        );
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        message: RESPONSE_MESSAGES.CANDIDATES_FOUND,
        candidates: candidates,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const addCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      zip,
      driverLicense,
      priorDriverLicense,
      phoneNumber,
      email,
      companyId,
    } = req.body;
    const newCandidate = new Candidate({
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      zip,
      driverLicense,
      priorDriverLicense,
      phoneNumber,
      email,
      companyId,
    });
    const savedCandidate = await newCandidate.save();
    res.status(201).json({
      message: RESPONSE_MESSAGES.CANDIDATE_ADDED,
      candidates: savedCandidate,
    });
  } catch (error) {
    next(error);
  }
};

export const getCandidateById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.candidateId;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      const error: CustomError = new Error(
        RESPONSE_MESSAGES.CANDIDATE_NOT_FOUND
      );
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: RESPONSE_MESSAGES.CANDIDATE_FOUND,
      candidate: candidate,
    });
  } catch (error) {
    next(error);
  }
};

export const addAdverseAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status, preNotice, postNoticeSentOn, candidateId } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      const error: CustomError = new Error(
        RESPONSE_MESSAGES.CANDIDATE_NOT_FOUND
      );
      error.statusCode = 404;
      throw error;
    }

    const newNotice = new Notice({
      status,
      preNotice,
      postNoticeSentOn,
      candidateId,
    });

    const savedNotice = await newNotice.save();

    candidate.notice = savedNotice._id;
    await candidate.save();

    res.status(201).json({
      message: RESPONSE_MESSAGES.ADVERSE_ACTION_SENT,
      notice: savedNotice,
    });
  } catch (error) {
    next(error);
  }
};
