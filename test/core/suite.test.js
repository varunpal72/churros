'use strict';

require('core/assertions');
const suite = require('core/suite');
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

describe('suite', () => {
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
      .reply(200, () => [genPayload({ id: 123 })])
      .get('/foo/search')
      .query({ foo: 'bar' })
      .reply(200, () => [genPayload({ id: 123 })]);

    /** PATCH && PUT **/
    nock(baseUrl, headers())
      .patch('/foo/123')
      .reply(200, (uri, requestBody) => {
        requestBody.id = 123;
        return requestBody;
      })
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
      .reply(400, (uri, requestBody) => ({ message: 'Invalid JSON body' }))
      .post('/foo/file')
      .reply(200, (uri, requestBody) => genPayload({ id: 123 }))
      .post('/foo/bad/file')
      .reply(404, (uri, requestBody) => ({ message: 'No resource found at /foo/bad/file' }))
      .post('/events/myelement')
      .reply(200, (uri, requestBody) => requestBody)
      .post('/foo/pagination')
      .reply(200, (uri, requestBody) => genPayload({ id: 123 }));

    /** GET **/
    nock(baseUrl, headers())
      .get('/foo/123')
      .reply(200, () => genPayload({ id: 123 }))
      .get('/foo/456')
      .reply(404, () => ({ message: 'No foo found with the given ID' }))
      .get('/foo/bad')
      .reply(404, () => ({ message: 'No resource found with name /foo/bad' }))
      .get('/foo')
      .reply(200, (uri, requestBody) => [genPayload({ id: 123 }), genPayload({ id: 456 })])
      .get('/foo')
      .query({ page: '1', pageSize: '1' })
      .reply(200, () => genPayload({ id: 123 }))
      .get('/foo')
      .query({ where: 'id=\'123\'' })
      .reply(200, () => [genPayload({ id: 123 })])
      .get('/foo/pagination')
      .query(true)
      .reply(200, () => [genPayload({ id: 123 })]);

    /** PATCH && PUT **/
    nock(baseUrl, headers())
      .patch('/foo/123')
      .reply(200, (uri, requestBody) => {
        requestBody.id = 123;
        return requestBody;
      })
      .patch('/foo/456')
      .reply(404, (uri, requestBody) => ({ message: 'No foo found with the given ID' }))
      .put('/foo/123')
      .reply(200, (uri, requestBody) => {
        requestBody.id = 123;
        return requestBody;
      })
      .put('/foo/456')
      .reply(404, (uri, requestBody) => ({ message: 'No foo found with the given ID' }));

    /** DELETE **/
    nock(baseUrl, headers())
      .delete('/foo/123')
      .reply(200, (uri, requestBody) => ({}))
      .delete('/foo/456')
      .reply(404, (uri, requestBody) => ({ message: 'No foo found with the given ID' }))
      .delete('/foo/pagination/123')
      .reply(200, (uri, requestBody) => ({}));
  });

  /* Not passing in any suite options */
  suite.forElement('fakehub', 'resource', (test) => {
    it('should support suite for element', () => expect(test.api).to.equal('/hubs/fakehub/resource'));
  });

  /* Not passing in any suite options */
  suite.forPlatform('platformresource', (test) => {
    it('should support suite for platform', () => expect(test.api).to.equal('/platformresource'));
  });

  /* Passing in payload and schema options, which are the defaults used, unless overridden, for all tests inside suite */
  suite.forPlatform('foo', { payload: genPayload(), schema: genSchema() }, (test) => {
    /* all of these are equivalent just as examples */
    test.should.return200OnPost();
    test
      .withApi('/foo')
      .should.return200OnPost();
    test
      .withJson(genPayload())
      .should.return200OnPost();
    test
      .withValidation(genSchema())
      .should.return200OnPost();
    test
      .withApi('/foo')
      .withJson(genPayload())
      .withValidation(genSchema())
      .should.return200OnPost();
    test
      .withJson(genPayload())
      .withValidation(genSchema())
      .withApi('/foo')
      .should.return200OnPost();
    test
      .withOptions({})
      .should.return200OnPost();
    test
      .withApi('/foo')
      .withOptions({})
      .should.return200OnPost();

    /* all of these are equivalent just as examples */
    test.should.return404OnPatch(456);
    test
      .withApi(`${test.api}/456`)
      .should.return404OnPatch();

    /* with options, extends the request libraries options object */
    test
      .withOptions({ qs: { page: 1, pageSize: 1 } })
      .should.return200OnGet();

    /* withApi overrides the default api that was passed in to the `suite.forPlatform` above */
    test
      .withApi(`${test.api}/456`)
      .should.return404OnGet();
    test
      .withApi('/foo/456')
      .should.return404OnPut();
    test
      .withApi('/foo/456')
      .should.return404OnDelete();
    test
      .withApi('/foo/pagination')
      .should.supportNextPagePagination(1);

    /* no with... functions, which will just use the defaults that were passed in to the `suite.forPlatform` above */
    test.should.return200OnPost();
    test.should.return404OnGet(456);
    test.should.supportSr();
    test.should.supportCruds();
    test.should.supportCruds(chakram.put);
    test.should.supportCrud();
    test.should.supportCrus();
    test.should.supportCrd();
    test.should.supportCd();
    test.should.supportCrds();
    test.should.supportCrs();
    test.should.supportPagination();
    test.should.supportCeqlSearch('id');

    /* overriding the default API that was passed in as the default in the `suite.forPlatform` */
    test
      .withApi('/foo/bad')
      .should.return400OnPost();

    /* examples of using .withName(...) which will set the name of the test to be whatever string is passed in */
    test
      .withName('this should be the name of the test')
      .should.return200OnPost();
    test
      .withApi('/foo/bad')
      .withName('this should be the name of the test')
      .should.return400OnPost();

    test
      .withName('should allow overriding the api and the options with new values')
      .withApi(`${test.api}/search`)
      .withOptions({ qs: { foo: 'bar' } })
      .should.return200OnGet();
  });
});

/* This test exercises all of the available optional suite options */
const opts = {
  name: 'this will override the resource that was passed in',
  payload: genPayload(),
  schema: genSchema()
};
suite.forPlatform('exampleResourceName', opts, (test) => {});
