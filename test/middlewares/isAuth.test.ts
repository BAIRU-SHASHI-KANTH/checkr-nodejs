const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const { RESPONSE_MESSAGES } = require("../../src/util/constants");
import { Response } from "express";
import { isAuth } from "../../src/middlewares/is-auth";

describe('Auth middleware', function() {
  it('should throw an error if no authorization header is present', function() {
    const req = {
      get: function() {
        return null;
      }
    };
    expect(isAuth.bind(this, req, {} as Response, () => {})).to.throw(
      RESPONSE_MESSAGES.NOT_AUTHENTICATED_NO_TOKEN
    );
  });

  it('should throw an error if the authorization header is only one string', function() {
    const req = {
      get: function() {
        return 'xxxxxxxxxx';
      }
    };
    expect(isAuth.bind(this, req, {} as Response, () => {})).to.throw();
  });

  it('should yield a userId after decoding the token', function() {
    const req = {
      get: function() {
        return 'Bearer xxxxxxxxxx';
      }
    };
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({ userId: 'user' });
    isAuth(req, {} as Response, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'user');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it('should throw an error if the token cannot be verified', function() {
    const req = {
      get: function() {
        return 'Bearer xxxxxxxxx';
      }
    };
    expect(isAuth.bind(this, req, {} as Response, () => {})).to.throw();
  });
});