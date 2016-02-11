'use strict';

require('core/assertions');
const tester = require('core/tester');
const nock = require('nock');
const chakram = require('chakram');
const expect = chakram.expect;

const baseUrl = 'https://api.cloud-elements.com/elements/api-v2;';
const auth = 'User fake, Organization fake';
const eiId = 789;

const headers = () => new Object({ reqheaders: { 'Authorization': (value) => value === auth } });

const eventHeaders = () => new Object({
  reqheaders: {
    'Authorization': (value) => value === auth,
    'Element-Instances': (value) => value === eiId
  }
});

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

beforeEach(() => {
  chakram.setRequestDefaults({
    baseUrl: baseUrl,
    headers: { Authorization: auth }
  });

  /** MOCKING OUT HTTP ENDPOINTS **/
  /** https://github.com/pgte/nock#specifying-hostname **/

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
    .reply(200, (uri, requestBody) => genPayload({ id: 123 }))
    .post('/foo/bad/file')
    .reply(404, (uri, requestBody) => {
      return { message: 'No resource found at /foo/bad/file' };
    });

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
    .get('/foo/bad')
    .reply(404, () => {
      return { message: 'No resource found with name /foo/bad' };
    })
    .get('/foo')
    .reply(200, (uri, requestBody) => [genPayload({ id: 123 }), genPayload({ id: 456 })])
    .get('/foo')
    .query({ page: '1', pageSize: '1' })
    .reply(200, () => genPayload({ id: 123 }))
    .get('/foo')
    .query({ where: 'id=\'123\'' })
    .reply(200, () => [genPayload({ id: 123 })]);

  /** PATCH && PUT **/
  nock(baseUrl, headers())
    .patch('/foo/123')
    .reply(200, (uri, requestBody) => {
      requestBody.id = 123;
      return requestBody;
    })
    .patch('/foo/456')
    .reply(404, (uri, requestBody) => {
      return { message: 'No foo found with the given ID' };
    })
    .put('/foo/123')
    .reply(200, (uri, requestBody) => {
      requestBody.id = 123;
      return requestBody;
    })
    .put('/foo/456')
    .reply(404, (uri, requestBody) => {
      return { message: 'No foo found with the given ID' };
    });

  /** DELETE **/
  nock(baseUrl, headers())
    .delete('/foo/123')
    .reply(200, (uri, requestBody) => {
      return {};
    });
});

describe('tester', () => {
  tester.forElement('fakehub', 'resource', null, null, (test) => {
    it('should support suite for element', () => expect(test.api).to.equal('/hubs/fakehub/resource'));
  });

  tester.forPlatform('platformresource', null, null, (test) => {
    it('should support suite for platform', () => expect(test.api).to.equal('/platformresource'));
  });

  tester.forPlatform('foo', genPayload(), genSchema(), (test) => {
    test.should.return404OnPatch(456);
    test.should.return404OnGet(456);

    // NOTE: all of these are equivalent
    test.should.return200OnPost();
    test.withApi('/foo').should.return200OnPost();
    test.withJson(genPayload()).should.return200OnPost();
    test.withSchema(genSchema()).should.return200OnPost();
    test.withApi('/foo').withJson(genPayload()).withSchema(genSchema()).should.return200OnPost();

    test.should.return200OnPost();
    test.should.supportCruds();
    test.should.supportCruds(chakram.put);
    test.should.supportCrud();
    test.should.supportCrd();
    test.should.supportCrds();
    test.should.supportPagination();
    test.should.supportCeqlSearch('id');
    test.withApi('/foo/bad').should.return400OnPost();
  });
});
