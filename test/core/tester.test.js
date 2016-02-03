const tester = require('core/tester');
const nock = require('nock');
const chakram = require('chakram');
const tools = require('core/tools');

const baseUrl = 'https://api.cloud-elements.com/elements/api-v2;';

before((done) => {
  tools.initializeChakram();
  chakram.setRequestDefaults({
    baseUrl: baseUrl,
    headers: {
      Authorization: 'User fake, Organization fake'
    }
  });
  done();
});

describe('tester', () => {
  it('should support post', () => {
    nock(baseUrl)
      .post('/foo')
      .reply(200, (uri, requestBody) => {
        requestBody.id = tools.randomInt();
        return requestBody;
      });

    const payload = {
      foo: 'bar'
    };
    return tester.post('/foo', payload);
  });

  it('should support get', () => {
    nock(baseUrl)
      .get('/foo')
      .reply(200, () => {
        return { foo: 'bar' };
      });

    return tester.get('/foo');
  });
});
