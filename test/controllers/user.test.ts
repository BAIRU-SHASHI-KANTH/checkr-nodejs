const expect = require("chai").expect;
const sinon = require("sinon");
const { RESPONSE_MESSAGES } = require("../../src/util/constants");
import { NextFunction, Request } from "express";
import User from "../../src/models/user";
import { CustomError } from "../../src/util/types";
const mongoose = require("mongoose");
const ObjectId = mongoose.ObjectId;
import { loginUser, signupUser, getAllUsers } from "../../src/controllers/user";
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.port ?? 3003;
const TEST_DB_URL = process.env.test_dbUrl;

describe("User controller", function () {
  before(function (done) {
    mongoose.connect(TEST_DB_URL).then((result: any) => {
      done();
    });
  });

  it("should sign up", function (done) {
    const req = {
      body: {
        name: "testing",
        email: "Testing@gmail.com",
        password: "testing@123",
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
    signupUser(req as any, res as any, () => {}).then(() => {
      expect(res.statusCode).to.equal(201);
      expect(res.jsonData.message).to.equal(
        RESPONSE_MESSAGES.USER_REGISTERED_SUCCESSFULLY
      );
      done();
    });
  });
  it("should through error if tried to sign up and dp operation fails", (done) => {
    const saveStub = sinon.stub(User.prototype, "save");
    const mockError = new Error("Database error");
    saveStub.rejects(mockError);

    const req = {
      body: {
        name: "testing",
        email: "Testing@gmail.com",
        password: "testing@123",
        companyId: "6463a98d5e8cf3b5ae9c0e30",
      },
    };

    let nextCalled = false;
    const mockNext = (error: CustomError) => {
      nextCalled = true;
      expect(error).to.exist;
      // expect(error.message).to.equal("Database error");
    };

    signupUser(req as any, {} as any, mockNext as NextFunction)
      .then(() => {
        expect(nextCalled).to.be.true;
        done();
      })
      .catch((error: any) => {
        done(error);
      });
    sinon.restore();
  });

  it("should login successfully", function (done) {
    const req = {
      body: {
        email: "Testing@gmail.com",
        password: "testing@123",
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
    loginUser(req as any, res as any, () => {}).then(() => {
      expect(res.statusCode).to.equal(200);
      expect(res.jsonData.message).to.equal(
        RESPONSE_MESSAGES.USER_LOGIN_SUCCESS
      );
      done();
    });
  });

  it("should throw error when tried to login with wrong pass", async () => {
    const req = {
      body: {
        email: "Testing@gmail.com",
        password: "wrongpass",
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

    let nextCalled = false;
    const mockNext = (error: CustomError) => {
      nextCalled = true;
      expect(error).to.exist;
      expect(error.message).to.equal(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
      expect(error.statusCode).to.equal(401);
    };

    await loginUser(req as any, res as any, mockNext as NextFunction);
    expect(nextCalled).to.be.true;
  });
  it("should throw error when tried to login with non existing user email id", async () => {
    const req = {
      body: {
        email: "wrong-emailId",
        password: "testing@123",
      },
    };

    let nextCalled = false;
    const mockNext = (error: CustomError) => {
      nextCalled = true;
      expect(error).to.exist;
      expect(error.message).to.equal(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
      expect(error.statusCode).to.equal(401);
    };

    await loginUser(req as any, {} as any, mockNext as NextFunction);
    expect(nextCalled).to.be.true;
  });

  it("get all users", async () => {
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
    await getAllUsers({} as Request, res as any, () => {});
    expect(res.statusCode).to.equal(200);
    expect(res.jsonData.message).to.equal(RESPONSE_MESSAGES.USERS_FOUND);
  });

  it("get all users throws error if db operation fails", async () => {
    const findStub = sinon.stub(User, "find");
    const mockError = new Error("Database error");
    findStub.rejects(mockError);

    let nextCalled = false;
    const mockNext = (error: CustomError) => {
      nextCalled = true;
      expect(error).to.exist;
    };

    await getAllUsers({} as any, {} as any, mockNext as NextFunction);
    expect(nextCalled).to.be.true;

    sinon.restore();
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });
});
