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

  it('should support initializing our custom chakram expectations', () => {
    const mockResponse = {
      response: {
        statusCode: 200,
        body: { id: 123 }
      }
    };

    // until we add our custom assertions, they should not exist
    try {
      expect(mockResponse).to.have.statusCode(200);
    } catch (e) {
      expect(e).to.be.an.instanceof(TypeError);
    }

    const schema = {
      type: 'object',
      properties: { id: { type: "number" } },
      required: ['id']
    };
    try {
      expect(mockResponse).to.have.schemaAnd200(schema);
    } catch (e) {
      expect(e).to.be.an.instanceof(TypeError);
    }

    tools.addCustomAssertions();

    expect(mockResponse).to.have.statusCode(200);
    expect(mockResponse).to.have.schemaAnd200(200);
  });

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
