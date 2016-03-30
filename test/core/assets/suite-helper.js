'use strict';

const nock = require('nock');

var exports = module.exports = {};
const genPayload = (opts) => {
  opts = opts || {};
  return new Object({
    id: (opts.id || null),
    foo: (opts.foo || 'bar')
  });
};
exports.genPayload = genPayload;

const genSchema = () => new Object({
  type: ['object', 'array'],
  properties: {
    id: { type: "number" },
    foo: { type: "string" }
  },
  required: ['id', 'foo']
});
exports.genSchema = genSchema;

/** MOCKING OUT HTTP ENDPOINTS **/
/** https://github.com/pgte/nock#specifying-hostname **/
exports.mock = (baseUrl, headers, eventHeaders) => {
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
};
