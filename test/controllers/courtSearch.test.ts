const expect = require("chai").expect;
const { RESPONSE_MESSAGES } = require("../../src/util/constants");
import { NextFunction, Request } from "express";
import Candidate from "../../src/models/candidate";
import CourtSearch from "../../src/models/courtSearch";
import { CustomError } from "../../src/util/types";
const mongoose = require("mongoose");
import {
  getCourtSearch,
  addCourtSearch,
} from "../../src/controllers/courtSearch";
const dotenv = require("dotenv");
dotenv.config();
const TEST_DB_URL = process.env.test_dbUrl;

describe("report controller", function () {
  before(function (done) {
    mongoose.connect(TEST_DB_URL).then((result: any) => {
      done();
    });
  });

  it("should throw error when tried to get courtSearch for not available candidate", async () => {
    const req = { params: { candidateId: "647786907c2718d4c939723d" } };
    let nextCalled = false;
    const mockNext = (error: CustomError) => {
      nextCalled = true;
      expect(error).to.exist;
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal(RESPONSE_MESSAGES.COURT_SEARCH_NOT_FOUND);
    };
    await getCourtSearch(req as any, {} as any, mockNext as NextFunction);
    expect(nextCalled).to.equal(true);
  });

  it("should throw error when tried to add report for non existing candidate", async () => {
    const req = {
      body: {
        status: "considered",
        location: "New York",
        violation: "Speeding",
        reportedDate: "2023-05-31T00:00:00Z",
        candidateId: "647786907c2718d4c939723d",
      },
    };
    let nextCalled = false;
    const mockNext = (error: CustomError) => {
      nextCalled = true;
      expect(error).to.exist;
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal(RESPONSE_MESSAGES.CANDIDATE_NOT_FOUND);
    };

    await addCourtSearch(req as Request, {} as any, mockNext as NextFunction);
    expect(nextCalled).to.equal(true);
  });

  it("should add report successfully", async () => {
    const candidate = new Candidate({
      _id: "647786907c2718d4c939723d",
      firstName: "shashi",
      middleName: "kanth",
      lastName: "bairu",
      dateOfBirth: "1990-04-04",
      zip: "123406",
      driverLicense: "ABC123rsadf",
      priorDriverLicense: "XYZ456aqerzxv",
      phoneNumber: "9999999999",
      email: "viratkohlih@example.com",
      companyId: "6463a98d5e8cf3b5ae9c0e30",
    });

    const newCandidate = await candidate.save();
    const req = {
      body: {
        status: "considered",
        location: "New York",
        violation: "Speeding",
        reportedDate: "2023-05-31T00:00:00Z",
        candidateId: newCandidate._id,
      },
    };
    const res = {
      statusCode: 500,
      jsonData: { message: "" },
      status: function (code: number) {
        this.statusCode = code;
        return this;
      },
      json: function (data: any) {
        this.jsonData = data;
      },
    };

    await addCourtSearch(req as Request, res as any, () => {});

    expect(res.statusCode).to.equal(200);
    expect(res.jsonData.message).to.equal(RESPONSE_MESSAGES.COURT_SEARCH_ADDED);
  });

  it("should get courtSearch successfully", async () => {
    const req = { params: { candidateId: "647786907c2718d4c939723d" } };

    const res = {
      statusCode: 500,
      jsonData: { message: "" },
      status: function (code: number) {
        this.statusCode = code;
        return this;
      },
      json: function (data: any) {
        this.jsonData = data;
      },
    };
    await getCourtSearch(req as any, res as any, () => {});
    expect(res.statusCode).to.equal(200);
    expect(res.jsonData.message).to.equal(RESPONSE_MESSAGES.COURT_SEARCH_FOUND);
  });

  after(async () => {
    await CourtSearch.deleteMany({});
    await Candidate.deleteMany({});
    await mongoose.disconnect();
  });
});
