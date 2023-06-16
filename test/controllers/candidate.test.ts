const expect = require("chai").expect;
const sinon = require("sinon");
const { RESPONSE_MESSAGES } = require("../../src/util/constants");
import { NextFunction, Request } from "express";
import Candidate from "../../src/models/candidate";
import Report from "../../src/models/report";
import { CustomError } from "../../src/util/types";
const mongoose = require("mongoose");
import {
  getAllCandidates,
  addCandidate,
  addAdverseAction,
  getCandidateById,
} from "../../src/controllers/candidate";
const dotenv = require("dotenv");
dotenv.config();
const TEST_DB_URL = process.env.test_dbUrl;

describe("candidate controller", function () {
  before(function (done) {
    mongoose.connect(TEST_DB_URL).then((result: any) => {
      done();
    });
  });

  it("should throw error when get all candidates called with no candidates present", async () => {
    const req = { query: { adverseActions: true } };

    let nextCalled = false;
    const mockNext = (error: CustomError) => {
      nextCalled = true;
      expect(error).to.exist;
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal(RESPONSE_MESSAGES.CANDIDATES_NOT_FOUND);
    };

    await getAllCandidates(req as any, {} as any, mockNext as NextFunction);
    expect(nextCalled).to.equal(true);
  });

  it("should get all candidates succesfully with filter", async () => {
    const candidate = new Candidate({
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
    const newReport = new Report({
      status: "clear",
      adjudication: "engaged",
      package: "Standard",
      completedAt: "2023-05-30T10:00:00Z",
      EstimatedCompletionTime: "2023-06-05T10:00:00Z",
      candidateId: newCandidate._id,
    });

    const savedReport = await newReport.save();

    newCandidate.report = savedReport._id;
    await newCandidate.save();

    const req = {
      query: { name: "shashi", status: ["clear"], adjudication: ["engaged"] },
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
    await getAllCandidates(req as any, res as any, () => {});
    expect(res.statusCode).to.equal(200);
    expect(res.jsonData.message).to.equal(RESPONSE_MESSAGES.CANDIDATES_FOUND);
  });
  it("should get all candidates succesfully with adverseActions true", async () => {
    const candidate = new Candidate({
      _id: "647786907c2718d4c939723a",
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

    await candidate.save();
    const req = { query: { adverseActions: "true" } };

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
    await getAllCandidates(req as any, res as any, () => {});
    expect(res.statusCode).to.equal(200);
    expect(res.jsonData.message).to.equal(
      RESPONSE_MESSAGES.CANDIDATES_WITH_ADVERSE_ACTION
    );
  });

  it("should add candidate successfully", async () => {
    const req = {
      body: {
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

    await addCandidate(req as Request, res as any, () => {});

    expect(res.statusCode).to.equal(201);
    expect(res.jsonData.message).to.equal(RESPONSE_MESSAGES.CANDIDATE_ADDED);
  });


  it("should add adverse action successfully", async () => {
    const req = {
      body: {
        status: "scheduled",
        preNotice: "2023-05-31T10:00:00Z",
        postNoticeSentOn: "2023-06-01T12:00:00Z",
        candidateId: "647786907c2718d4c939723a",
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

    await addAdverseAction(req as Request, res as any, () => {});

    expect(res.statusCode).to.equal(201);
    expect(res.jsonData.message).to.equal(RESPONSE_MESSAGES.ADVERSE_ACTION_SENT);
  });

  it("should throw error for add adverse action when tried to add for non existing candidate", async () => {
    const req = {
      body: {
        status: "scheduled",
        preNotice: "2023-05-31T10:00:00Z",
        postNoticeSentOn: "2023-06-01T12:00:00Z",
        candidateId: "647786907c2718d4c939723b",
      },
    };
    
    let nextCalled = false;
    const mockNext = (error: CustomError) => {
      nextCalled = true;
      expect(error).to.exist;
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal(RESPONSE_MESSAGES.CANDIDATE_NOT_FOUND);
    };

    await addAdverseAction(req as any, {} as any, mockNext as NextFunction);
    expect(nextCalled).to.equal(true);
  });


  it("should get candidate by id successfully", async () => {
    const req = {
      params: { candidateId: "647786907c2718d4c939723a" },
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

    await getCandidateById(req as any, res as any, () => {});

    expect(res.statusCode).to.equal(200);
    expect(res.jsonData.message).to.equal(RESPONSE_MESSAGES.CANDIDATE_FOUND);
  });
  it("should throw error for non existing candidate get by id ", async () => {
    const req = {
      params: { candidateId: "647786907c2718d4c939723b" },
    };
    let nextCalled = false;
    const mockNext = (error: CustomError) => {
      nextCalled = true;
      expect(error).to.exist;
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal(RESPONSE_MESSAGES.CANDIDATE_NOT_FOUND);
    };

    await getCandidateById(req as any, {} as any, mockNext as NextFunction);
    expect(nextCalled).to.equal(true);
  });

  after(async () => {
    await Candidate.deleteMany({});
    await mongoose.disconnect();
  });
});
