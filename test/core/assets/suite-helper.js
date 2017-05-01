'use strict';

const nock = require('nock');
const request = require('request');
const props = require('core/props');

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
    .post('/foo/conflict')
    .reply(409, (uri, requestBody) => {
      return { message: 'Already exists' };
    })
    .post('/foo/file')
    .reply(200, (uri, requestBody) => genPayload({ id: 123 }))
    .post('/foo/bad/file')
    .reply(404, (uri, requestBody) => {
      return { message: 'No resource found at /foo/bad/file' };
    })
    .post('/bulk')
    .reply(200, (uri, requestBody) => {
      var out = {};
      out.status = 'CREATED';
      out.id = 123;
      return out;
    });

  nock(baseUrl, eventHeaders())
    .post('/events/myelement')
    .reply(200, (uri, requestBody) => {
      props.setForKey('myelement', 'elementId', '123');
      return requestBody;
    });

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
    .reply(200, () => [genPayload({ id: 123 })])
    .get('/bulk/endpoint')
    .query({where: 'id = 123'})
    .reply(200, () => new Array(10).fill({id:123}))
    .get('/bulk/endpoint')
    .reply(200, () => new Array(10).fill({id:123}))
    .get('/bulk/status')
    .reply(200, (uri, requestBody) => {
      var out = {};
      out.status = 'COMPLETED';
      out.recordsCount = 10;
      out.recordsFailedCount = 0;
      return out;
    })
    .get('/bulk/errors')
    .reply(200, () => {})
    .get('/bulk/123/endpoint')
    .reply(200, () => new Array(10).fill(JSON.stringify({id:123})).join('\n') + '\n')
    .get('/elements/123/metadata')
    .reply(200, () => {
      return {
        events: {
          supported: true,
          methods: ['polling', 'webhook']
        }
      };
    });

    nock(baseUrl, { reqheaders: { accept: "application/json" } })
    .get('/bulk/123/endpoint')
    .reply(200, () => JSON.stringify(new Array(10).fill({id:123})));
    nock(baseUrl, { reqheaders: { accept: "text/csv" } })
    .get('/bulk/123/endpoint')
    .reply(200, () => JSON.stringify(new Array(10).fill({id:123})));


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
    .reply(200, (uri, requestBody) => genPayload({ id: 123 }))
    .post('/foo/polling')
    .reply(200, (uri, requestBody) => {
      setInterval(() => {
        request(props.get('eventCallbackUrl'), (err, res, body) => {});
      }, 1000);
      return genPayload({ id: 123 });
    });

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
    .query({page: '1', pageSize: '2'})
    .reply(200, () => [genPayload({ id: 123 }), genPayload({ id: 456 })])
    .get('/foo/pagination')
    .query({page: '2', pageSize: '2'})
    .reply(200, () => [genPayload({ id: 789 }), genPayload({ id: 101 })])
    .get('/foo/pagination')
    .query({page: '1', pageSize: '4'})
    .reply(200, () => [genPayload({ id: 123 }), genPayload({ id: 456 }),genPayload({ id: 789 }), genPayload({ id: 101 })])
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
    .delete('/bulk/123')
    .reply(200, (uri, requestBody) => ({}))
    .delete('/foo/pagination/123')
    .reply(200, (uri, requestBody) => ({}))
    .delete('/foo/polling/123')
    .reply(200, (uri, requestBody) => ({}));

};
