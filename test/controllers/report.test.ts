const expect = require("chai").expect;
const { RESPONSE_MESSAGES } = require("../../src/util/constants");
import { NextFunction, Request } from "express";
import Candidate from "../../src/models/candidate";
import Report from "../../src/models/report";
import { CustomError } from "../../src/util/types";
const mongoose = require("mongoose");
import { addReport, getReport } from "../../src/controllers/report.";
const dotenv = require("dotenv");
dotenv.config();
const TEST_DB_URL = process.env.test_dbUrl;

describe("report controller", function () {
  before(function (done) {
    mongoose.connect(TEST_DB_URL).then((result: any) => {
      done();
    });
  });

  it("should throw error if tried to add report for not existing candidate", function (done) {
    const req = {
      body: {
        status: "clear",
        adjudication: "engaged",
        packAge: "Standard",
        completedAt: "2023-05-30T10:00:00Z",
        EstimatedCompletionTime: "2023-06-05T10:00:00Z",
        candidateId: "647786907c2718d4c939723d",
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
    const mockNext = (error: CustomError) => {
      
      expect(error).to.exist;
      expect(error.statusCode).to.equal(404);
      expect(error.message).to.equal(RESPONSE_MESSAGES.CANDIDATE_NOT_FOUND);
    };
    addReport(req as any, res as any, mockNext as NextFunction).then(() => {
      done();
    });
  });
  it("should throw error when tried to get report for not available candidate Id",async ()=>{
    const req = { params:{candidateId:"647786907c2718d4c939723d"}}
    let nextCalled = false;
    const mockNext = (error: CustomError) => {
        nextCalled = true;
        expect(error).to.exist;
        expect(error.statusCode).to.equal(404);
        expect(error.message).to.equal(RESPONSE_MESSAGES.REPORT_NOT_FOUND);
    };
    await getReport(req as any,{} as any,mockNext as NextFunction);
    
  })

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
        status: "clear",
        adjudication: "engaged",
        packAge: "Standard",
        completedAt: "2023-05-30T10:00:00Z",
        EstimatedCompletionTime: "2023-06-05T10:00:00Z",
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

    await addReport(req as Request, res as any, () => {});

    expect(res.statusCode).to.equal(200);
    expect(res.jsonData.message).to.equal(RESPONSE_MESSAGES.REPORT_ADDED);
  });

  it("should get report successfully",async ()=>{
    const req = { params:{candidateId:"647786907c2718d4c939723d"}}
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
    await getReport(req as any,res as any,()=>{});
    expect(res.statusCode).to.equal(200);
    expect(res.jsonData.message).to.equal(RESPONSE_MESSAGES.REPORT_FOUND);
  })

  after(async () => {
    await Report.deleteMany({});
    await Candidate.deleteMany({});
    await mongoose.disconnect();
  });
});
