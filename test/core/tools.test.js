'use strict';

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const tools = require('core/tools');

describe('tools', () => {
  it('should support generating a random string', () => {
    const random = tools.random();
    expect(random).to.be.a('string');
  });

  it('should support generating a random email address', () => {
    const random = tools.randomEmail();
    expect(random).to.be.a('string');
    expect(random).to.include('@');
    expect(random).to.include('.com');
  });

  it('should support generating a random int', () => {
    const randomInt = tools.randomInt();
    expect(randomInt).to.be.a('number');
  });

  it('should support logging and throwing an error with an arg', () => {
    try {
      tools.logAndThrow('churros are tasty %s', Error, '1');
    } catch (e) {
      return true;
    }
    throw Error('oops...');
  });

  it('should support logging and throwing an error without an arg', () => {
    try {
      tools.logAndThrow('churros are tasty 1', Error);
    } catch (e) {
      return true;
    }
    throw Error('oops...');
  });

  it('should support encoding a string to base64', () => {
    const encoded = tools.base64Encode('ABCD');
    expect(encoded).to.be.a('string');
    expect(encoded).to.equal('QUJDRA==');
  });

  it('should support decoding a base64 value to a string', () => {
    const encoded = tools.base64Decode('QUJDRA==');
    expect(encoded).to.be.a('string');
    expect(encoded).to.equal('ABCD');
  });

  it('should support sleeping for x seconds', () => {
    tools.sleep(1);
  });

  it('should support waiting a specific time for a succesful predicate', () => {
    var i = 0;

    const pred = (cb) => {
      if(++i > 2) cb(true);
    };

    return expect(tools.wait.upTo(6000).for(pred)).to.eventually.equal(true);
  });

  it('should support waiting for a specifc time for an unsuccesful predicate', () => {
    const pred = (cb) => {
      return false;
    };

    return expect(tools.wait.upTo(6000).for(pred)).to.be.rejected;
  });

  it('should support waiting the default time for a succesful predicate', () => {
    var i = 0;

    const pred = (cb) => {
      if(++i > 2) cb(true);
    };

    return expect(tools.wait.for(pred)).to.eventually.equal(true);
  });

  it('should support waiting for the default time for an unsuccesful predicate', () => {
    const pred = (cb) => {
      return false;
    };

    return expect(tools.wait.for(pred)).to.be.rejected;
  });
});
