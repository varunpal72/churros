'use strict';

const tester = require('core/tester');
const nock = require('nock');
const chakram = require('chakram');
const expect = chakram.expect;
const tools = require('core/tools');
const fs = require('fs');

const baseUrl = 'https://api.cloud-elements.com/elements/api-v2;';
const auth = 'User fake, Organization fake';
const eiId = 789;

const headers = () => {
  return {
    reqheaders: { 'Authorization': (value) => value === auth }
  };
};

const eventHeaders = () => {
  return {
    reqheaders: {
      'Authorization': (value) => value === auth,
      'Element-Instances': (value) => value === eiId
    }
  };
};

const genPayload = (opts) => {
  opts = opts || {};
  return new Object({
    id: (opts.id || null),
    foo: (opts.foo || 'bar')
  });
};

const genSchema = () => new Object({
  type: ['object', 'array'],
  properties: {
    id: { type: "number" },
    foo: { type: "string" }
  },
  required: ['id', 'foo']
});

const setup = () => {
  tools.addCustomAssertions();
  chakram.setRequestDefaults({
    baseUrl: baseUrl,
    headers: { Authorization: auth }
  });

  /** MOCKING OUT HTTP ENDPOINTS **/

  /** POST **/
  nock(baseUrl, headers())
    .post('/foo')
    .reply(200, (uri, requestBody) => {
      requestBody.id = 123;
      return requestBody;
    })
    .post('/foo/bad')
    .reply(400, (uri, requestBody) => {
      return { message: 'Invalid JSON body' };
    })
    .post('/foo/file')
    .reply(200, (uri, requestBody) => genPayload({ id: 123 }));

  nock(baseUrl, eventHeaders())
    .post('/events/myelement')
    .reply(200, (uri, requestBody) => requestBody);

  /** GET **/
  nock(baseUrl, headers())
    .get('/foo/123')
    .reply(200, () => genPayload({ id: 123 }))
    .get('/foo/456')
    .reply(404, () => {
      return { message: 'No foo found with the given ID' };
    })
    .get('/foo')
    .reply(200, (uri, requestBody) => [genPayload({ id: 123 }), genPayload({ id: 456 })]);

  /** PATCH && PUT **/
  nock(baseUrl, headers())
    .patch('/foo/123')
    .reply(200, (uri, requestBody) => {
      requestBody.id = 123;
      return requestBody;
    })
    .put('/foo/123')
    .reply(200, (uri, requestBody) => {
      requestBody.id = 123;
      return requestBody;
    });

  /** DELETE **/
  nock(baseUrl, headers())
    .delete('/foo/123')
    .reply(200, (uri, requestBody) => {
      return {};
    });
};

describe('tester', () => {
  it('should support post', () => {
    setup();
    return tester.post('/foo', genPayload(), genSchema());
  });

  it('should support post with custom validation', () => {
    setup();
    return tester.post('/foo/bad', {}, (r) => expect(r).to.have.statusCode(400));
  });

  it('should support post with no schema or custom validation', () => {
    setup();
    return tester.post('/foo', genPayload());
  });

  it('should support get', () => {
    setup();
    return tester.get('/foo/123', genSchema());
  });

  it('should support get with custom validation', () => {
    setup();
    return tester.get('/foo/456', (r) => expect(r).to.have.statusCode(404));
  });

  it('should support put', () => {
    setup();
    return tester.put('/foo/123', genPayload(), genSchema());
  });

  it('should support patch', () => {
    setup();
    return tester.patch('/foo/123', genPayload({ id: 123 }), genSchema());
  });

  it('should support delete', () => {
    setup();
    return tester.delete('/foo/123');
  });

  it('should support find', () => {
    setup();
    return tester.find('/foo', genSchema());
  });

  it('should support post file', () => {
    setup();

    // should really NOT depend on the file system here :/
    const filePath = '.tmp';
    fs.closeSync(fs.openSync(filePath, 'w'));
    tester.postFile('/foo/file', filePath, null, genSchema());
    fs.unlink(filePath);

    return true;
  });

  it('should support crd', () => {
    setup();
    return tester.crd('/foo', genPayload(), genSchema());
  });

  it('should support crud', () => {
    setup();
    return tester.crud('/foo', genPayload(), genSchema());
  });

  it('should support cruds', () => {
    setup();
    return tester.cruds('/foo', genPayload(), genSchema());
  });

  it('should support creating events', () => {
    setup();
    return tester.createEvents('myelement', eiId, genPayload(), 2);
  });
});
