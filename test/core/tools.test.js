'use strict';

const chai = require('chai');
const expect = chai.expect;
const tools = require('core/tools');

describe('tools', () => {
  it('should support generating a random string', () => {
    const random = tools.random();
    expect(random).to.be.a('string');
  });

  it('should support generating a random string', () => {
    const random = tools.randomStr("aAeEiIoOuU", 4);
    expect(random).to.be.a('string');
    expect(random).to.have.lengthOf(4);
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

  it('should support sleeping for x seconds', () => tools.sleep(1));

  it('should support waiting a specific time for a succesful predicate', () => {
    let i = 0;
    const pred = () => new Promise((res, rej) => ++i > 2 ? res(true) : rej());
    return tools.wait.upTo(10000).for(pred)
      .then(r => expect(r).to.equal(true));
  });

  it('should support waiting for a specific time for an unsuccesful predicate', () => {
    const pred = () => new Promise((res, rej) => rej());
    return tools.wait.upTo(1000).for(pred)
      .then(r => {
        throw Error('Failed');
      })
      .catch(e => true);
  });

  it('should support waiting the default time for a succesful predicate', () => {
    let i = 0;
    const pred = () => new Promise((res, rej) => ++i > 2 ? res(true) : rej());
    return tools.wait.for(pred)
      .then(r => expect(r).to.equal(true));
  });

  it('should support waiting for the default time for an unsuccesful predicate', () => {
    const pred = () => new Promise((res, rej) => rej(false));
    return tools.wait.for(pred)
      .then(r => {
        throw Error('Failed');
      })
      .catch(r => true);
  });

  it('should allow stringifying an object', () => tools.stringify({ foo: 'bar' }));

  it('should allow loading an asset file', () => tools.copyAsset(require.resolve('./assets/test.json')));

  it('should allow running a function x number of times', () => {
    const res = tools.times(5)(() => 'foo');
    expect(res).to.have.length(5);
    res.map(r => expect(r).to.equal('foo'));
  });
  it('should run a script file', () => {
    tools.runFile('foo', './assets/testScript.js', 'bar')
    .then(r => expect(r).to.equal('foo:bar'))
    .then(r => tools.runFile('foo', './fake/file/path', 'bar'))
    .then(r => expect(r).to.equal(null));
  });
  it('should get base element', () => {
    const element = 'hubspot--oauth2';
    const baseElement = 'hubspot';
    return expect(tools.getBaseElement(element)).to.equal(baseElement);
  });
});
