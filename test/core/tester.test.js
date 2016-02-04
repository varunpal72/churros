const tester = require('core/tester');
const nock = require('nock');
const chakram = require('chakram');
const tools = require('core/tools');

const baseUrl = 'https://api.cloud-elements.com/elements/api-v2;';

const setup = () => {
  tools.addCustomAssertions();
  chakram.setRequestDefaults({
    baseUrl: baseUrl,
    headers: { Authorization: 'User fake, Organization fake' }
  });
};

describe('tester', () => {
  it('should support post', () => {
    setup();
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
    setup();
    nock(baseUrl)
      .get('/foo')
      .reply(200, () => {
        return { foo: 'bar' };
      });

    return tester.get('/foo');
  });

  it('should support put', () => {
    setup();
    nock(baseUrl)
      .put('/foo/123')
      .reply(200, (uri, requestBody) => {
        return requestBody;
      });

    const payload = {
      foo: 'bar'
    };
    return tester.put('/foo/123', payload);
  });
});
