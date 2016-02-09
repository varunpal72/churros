const chakram = require('chakram');
const expect = chakram.expect;
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

});
