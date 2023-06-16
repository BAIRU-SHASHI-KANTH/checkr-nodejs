const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const { RESPONSE_MESSAGES } = require("../../src/util/constants");
import { Response } from "express";
import { errorHandler } from "../../src/middlewares/errorHandler";
import { CustomError } from "../../src/util/types";

describe('error Handler middleware', function() {
  it('should throw an error if no authorization header is present', async()=> {
    const error ={
        statusCode : 404,
        message : "message",
        data: 'data'
    }

    const res = {
        statusCode: 500,
        jsonData: {error:{
            message : "",
            data: ''
        }},
        status: function (code: number) {
          this.statusCode = code;
          return this;
        },
        json: function (data: any) {
          this.jsonData = data;
        },
      };
    errorHandler(error as CustomError,res as any, {} as any, () => {});
    expect(res.statusCode).to.equal(404)
    expect(res.jsonData.error.message).to.equal('message');
    expect(res.jsonData.error.data).to.equal('data');
  });
});