const chakram = require('chakram');
const expect = chakram.expect;
const tools = require('core/tools');

describe('tools', () => {
  it('should support generating a random string', () => {
    const random = tools.random();
    expect(random).to.be.a('string');
  });

  it('should support generating a random int', () => {
    const randomInt = tools.randomInt();
    expect(randomInt).to.be.a('number');
  });

  it('should support logging and throwing an error', () => {
    try {
      tools.logAndThrow('churros are tasty %s', Error, '1');
    } catch (e) {
      return true;
    }
    throw Error('oops...');
  });

  it('should support initializing our custom chakram expectations', () => tools.initializeChakram());

  it('should support resetting the auth with an element token', () => {
    const props = require('core/props')({
      'user.secret': 'ChurrosUserSecret',
      'org.secret': 'ChurrosOrgSecret',
      'url': 'ChurrosUrl'
    });
    tools.authReset(props, 'TestToken');
  });

  it('should support resetting the auth without an element token', () => {
    const props = require('core/props')({
      'user.secret': 'ChurrosUserSecret',
      'org.secret': 'ChurrosOrgSecret',
      'url': 'ChurrosUrl'
    });
    tools.authReset(props);
  });
});
