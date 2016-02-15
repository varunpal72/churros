'use strict';

require('core/assertions');
require('core/logger')('debug');
const cloud = require('core/cloud');
const nock = require('nock');
const chakram = require('chakram');
const expect = chakram.expect;
const fs = require('fs');

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

describe('cloud', () => {
  it('should support post', () => cloud.post('/foo', genPayload(), genSchema()));
  it('should support post with custom validation', () => cloud.post('/foo/bad', {}, (r) => expect(r).to.have.statusCode(400)));
  it('should support post with no schema or custom validation', () => cloud.post('/foo', genPayload()));
  it('should throw an error if post validation fails', () => {
    return cloud.post('/foo/bad', {}, (r) => expect(r).to.have.statusCode(200))
      .then(r => {
        throw Error('Where my error at?');
      })
      .catch(r => true);
  });

  it('should support get', () => cloud.get('/foo/123', genSchema()));
  it('should support get with custom validation', () => cloud.get('/foo/456', (r) => expect(r).to.have.statusCode(404)));
  it('should support get with no schema or custom validation', () => cloud.get('/foo/123'));
  it('should throw an error if get validation fails', () => {
    return cloud.get('/foo/456', (r) => expect(r).to.have.statusCode(200))
      .then(r => {
        throw Error('Where my error at?');
      })
      .catch(r => true);
  });

  it('should support put', () => cloud.put('/foo/123', genPayload(), genSchema()));
  it('should support put with custom validation', () => cloud.put('/foo/456', genPayload(), (r) => expect(r).to.have.statusCode(404)));
  it('should support put with no schema or custom validation', () => cloud.put('/foo/123', genPayload()));
  it('should throw an error if put validation fails', () => {
    return cloud.put('/foo/456', genPayload(), (r) => expect(r).to.have.statusCode(200))
      .then(r => {
        throw Error('Where my error at?');
      })
      .catch(r => true);
  });

  it('should support patch', () => cloud.patch('/foo/123', genPayload({ id: 123 }), genSchema()));
  it('should support patch with custom validation', () => cloud.patch('/foo/456', genPayload(), (r) => expect(r).to.have.statusCode(404)));
  it('should support patch with no schema or custom validation', () => cloud.put('/foo/123', genPayload()));
  it('should throw an error if patch validation fails', () => {
    return cloud.patch('/foo/456', genPayload(), (r) => expect(r).to.have.statusCode(200))
      .then(r => {
        throw Error('Where my error at?');
      })
      .catch(r => true);
  });

  it('should support delete', () => cloud.delete('/foo/123'));
  it('should throw an error if delete validation fails', () => {
    return cloud.delete('/foo/456')
      .then(r => {
        throw Error('Where my error at?');
      })
      .catch(r => true);
  });

  it('should support find', () => cloud.find('/foo', genSchema()));
  it('should throw an error if find validation fails', () => {
    return cloud.find('/foo/bad', (r) => expect(r).to.have.statusCode(200))
      .then(r => {
        throw Error('Where my error at?');
      })
      .catch(r => true);
  });

  it('should support crd', () => cloud.crd('/foo', genPayload(), genSchema()));
  it('should support crds', () => cloud.crds('/foo', genPayload(), genSchema()));
  it('should support crud', () => cloud.crud('/foo', genPayload(), genSchema()));
  it('should support cruds', () => cloud.cruds('/foo', genPayload(), genSchema()));
  it('should support creating events', () => cloud.createEvents('myelement', eiId, genPayload(), 2));

  it('should support listening for events with custom validation', () => {
    return new Promise((res, rej) => {
      const port = 8085;
      cloud.listenForEvents(port, 1, 5)
        .then(r => r.forEach(e => expect(e).to.not.be.empty))
        .then(r => res(r))
        .catch(r => rej('How embarrassing, I failed validating events: ' + r));
      chakram.setRequestDefaults({ headers: { 'User-Agent': 'churros-test' } });
      return chakram.post('http://localhost:' + port, { event: 'green hat' });
    });
  });

  it('should throw an error if event validation fails', () => {
    return new Promise((res, rej) => {
      const port = 8089;
      cloud.listenForEvents(port, 1, 5)
        .then(r => r.forEach(e => expect(e).to.be.empty))
        .then(r => rej('How embarrassing, I should have failed validating events: ' + r))
        .catch(r => res(r));
      chakram.setRequestDefaults({ headers: { 'User-Agent': 'churros-test' } });
      return chakram.post('http://localhost:' + port, { event: 'green hat' });
    });
  });

  it('should support post file', () => {
    // should really NOT depend on the file system here :/
    const filePath = '.tmp';
    fs.closeSync(fs.openSync(filePath, 'w'));
    return cloud.postFile('/foo/file', filePath, genSchema())
      .then(r => fs.unlink(filePath));
  });

  it('should throw an error if post file validation fails', () => {
    const filePath = '.tmp';
    fs.closeSync(fs.openSync(filePath, 'w'));
    return cloud.postFile('/foo/bad/file', filePath, genSchema())
      .then(r => {
        throw Error('Where my error at?');
      })
      .catch(r => {
        fs.unlink(filePath);
        return true;
      });
  });
});