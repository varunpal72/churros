'use strict';

const tools = require('core/tools');
const http = require('http');
const fs = require('fs');
const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const logger = require('winston');

var exports = module.exports = {};

const validator = (schemaOrValidationCb) => {
  if (typeof schemaOrValidationCb === 'function') {
    return (r) => {
      schemaOrValidationCb(r);
      return r;
    };
  } else if (typeof schemaOrValidationCb === 'undefined') {
    return (r) => {
      expect(r).to.have.statusCode(200);
      return r;
    };
  } else {
    return (r) => {
      expect(r).to.have.schemaAnd200(schemaOrValidationCb);
      return r;
    };
  }
};

const post = (api, payload, schema, options) => {
  logger.debug('POST %s with options %s', api, options);
  return chakram.post(api, payload, options)
    .then(r => validator(schema)(r))
    .catch(r => tools.logAndThrow('Failed to create %s', r, api));
};
exports.post = post;

const get = (api, schema, options) => {
  logger.debug('GET %s with options %s', api, options);
  return chakram.get(api, options)
    .then(r => validator(schema)(r))
    .catch(r => tools.logAndThrow('Failed to retrieve %s', r, api));
};
exports.get = get;

const update = (api, payload, schema, cb, options) => {
  cb = (cb || chakram.patch);
  logger.debug('%s %s with options %s', cb === chakram.patch ? 'PATCH' : 'PUT', api, options);

  return cb(api, payload, options)
    .then(r => validator(schema)(r))
    .catch(r => tools.logAndThrow('Failed to update %s', r, api));
};
exports.patch = (api, payload, schema, options) => update(api, payload, schema, chakram.patch, options);
exports.put = (api, payload, schema, options) => update(api, payload, schema, chakram.put, options);

const remove = (api, options) => {
  logger.debug('DELETE %s with options %s', api, options);
  return chakram.delete(api, options)
    .then(r => {
      expect(r).to.have.statusCode(200);
      return r;
    })
    .catch(r => tools.logAndThrow('Failed to delete %s', r, api));
};
exports.delete = remove;

const find = (api, schema, options) => {
  logger.debug('GET %s with options %s', api, options);
  return chakram.get(api, options)
    .then(r => validator(schema)(r))
    .catch(r => tools.logAndThrow('Failed to find %s', r, api));
};
exports.find = find;

const postFile = (api, filePath, schema, options) => {
  options = (options || {});
  options.formData = { file: fs.createReadStream(filePath) };

  return chakram.post(api, undefined, options)
    .then(r => validator(schema)(r))
    .catch(r => tools.logAndThrow('Failed to upload file to %s', r, api));
};
exports.postFile = postFile;

const crd = (api, payload, schema) => {
  return post(api, payload, schema)
    .then(r => get(api + '/' + r.body.id, schema))
    .then(r => remove(api + '/' + r.body.id));
};
exports.crd = crd;

const crds = (api, payload, schema) => {
  let createdId = -1;
  return post(api, payload, schema)
    .then(r => createdId = r.body.id)
    .then(r => get(api + '/' + createdId, schema))
    .then(r => find(api, schema))
    .then(r => remove(api + '/' + createdId));
};
exports.crds = crds;

const crud = (api, payload, schema, updateCb) => {
  return post(api, payload, schema)
    .then(r => get(api + '/' + r.body.id, schema))
    .then(r => update(api + '/' + r.body.id, payload, schema, updateCb))
    .then(r => remove(api + '/' + r.body.id));
};
exports.crud = crud;

const cruds = (api, payload, schema, updateCb) => {
  let createdId = -1;
  return post(api, payload, schema)
    .then(r => createdId = r.body.id)
    .then(r => get(api + '/' + createdId, schema))
    .then(r => update(api + '/' + createdId, payload, schema, updateCb))
    .then(r => find(api, schema))
    .then(r => remove(api + '/' + createdId));
};
exports.cruds = cruds;

const createEvents = (element, eiId, payload, numEvents) => {
  numEvents = (numEvents || 1);

  const api = '/events/' + element;
  const options = { headers: { 'Element-Instances': eiId } };

  logger.debug('Attempting to send %s events to %s', numEvents, api);
  let promises = [];
  for (var i = 0; i < numEvents; i++) {
    const response = chakram.post(api, payload, options);
    promises.push(response);
  }
  return chakram.all(promises);
};
exports.createEvents = createEvents;

const listenForEvents = (port, numEventsSent, waitSecs, validate) => {
  validate = (typeof callback === 'function') ? validate : () => {};
  let receivedEvents = 0;
  let events = [];
  return new Promise((resolve, reject) => {
      http.createServer((request, response) => {
          response.end('{}');
          receivedEvents++;
          events.push(request);
          logger.debug('%s event(s) received', receivedEvents);
          if (receivedEvents === numEventsSent) resolve(request);
        })
        .listen(port, "localhost", (err) => {
          err ? reject(err) : logger.debug('Waiting %s seconds to receive %s events on port %s', waitSecs, numEventsSent, port);
        });

      const msg = util.format('Did not receive all %s events before the %s second timer expired', numEventsSent, waitSecs);
      setTimeout(() => reject(msg), waitSecs * 1000);
    })
    .then(r => events.forEach(e => validate(e)));
};
exports.listenForEvents = listenForEvents;

const itPost = (api, payload, schema) => {
  const name = util.format('should allow creating a(n) %s', api);
  it(name, () => post(api, payload, schema));
};

const itCrd = (api, payload, schema) => {
  const name = util.format('should allow CRD for %s', api);
  it(name, () => crd(api, payload, schema));
};

const itCrds = (api, payload, schema) => {
  const name = util.format('should allow CRDS for %s', api);
  it(name, () => crd(api, payload, schema));
};

const itCrud = (api, payload, schema, updateCb) => {
  const name = util.format('should allow CRUD for %s', api);
  it(name, () => crud(api, payload, schema, updateCb));
};

const itCruds = (api, payload, schema, updateCb) => {
  const name = util.format('should allow CRUDS for %s', api);
  it(name, () => cruds(api, payload, schema, updateCb));
};

const itPagination = (api, schema, query) => {
  const name = util.format('should allow paginating %s', api);
  const options = { qs: { page: 1, pageSize: 1 } };

  it(name, () => find(api, schema, options));
};

const itGet404 = (api, invalidId) => {
  const name = util.format('should throw a 404 when trying to retrieve a(n) %s with an ID that does not exist', api);
  it(name, () => get(api + '/' + (invalidId || -1), (r) => expect(r).to.have.statusCode(404)));
};

const itPatch404 = (api, payload, invalidId) => {
  const name = util.format('should throw a 404 when trying to update a(n) %s with an ID that does not exist', api);
  it(name, () => update(api + '/' + (invalidId || -1), (payload || {}), (r) => expect(r).to.have.statusCode(404), chakram.patch));
};

const itPost400 = (api, payload) => {
  let name = util.format('should throw a 400 when trying to create a(n) %s with an %s JSON body', api);
  payload ?
    name = util.format(name, 'invalid') :
    name = util.format(name, 'empty');

  it(name, () => post(api, payload, (r) => expect(r).to.have.statusCode(400)));
};

const itCeqlSearch = (api, payload, field) => {
  const name = util.format('should support searching %s by %s', api, field);
  it(name, () => {
    let id;
    return post(api, payload)
      .then(r => {
        id = r.body.id;
        const clause = util.format("%s='%s'", field, r.body[field]); // have to escape where values with single quotes
        const options = { qs: { where: clause } };
        return get(api, (r) => {
          expect(r).to.have.statusCode(200);
          expect(r.body.length).to.equal(1);
        }, options);
      })
      .then(r => remove(api + '/' + id));
  });
};

exports.for = (hub, objectName, tests) => {
  describe(objectName, () => {
    let api = hub ? util.format('/hubs/%s/%s', hub, objectName) : util.format('/%s', objectName);

    // currying common test functions for easy-of-use
    exports.it = {};
    exports.it.shouldReturn400OnPost = (payload) => itPost400(api, payload);
    exports.it.shouldReturn400OnPost.with = itPost400;
    exports.it.shouldReturn404OnGet = (invalidId) => itGet404(api, invalidId);
    exports.it.shouldReturn404OnGet.with = itGet404;
    exports.it.shouldReturn404OnPatch = (payload, invalidId) => itPatch404(api, payload, invalidId);
    exports.it.shouldReturn404OnPatch.with = itPatch404;
    exports.it.shouldReturn404OnGet = (invalidId) => itGet404(api, invalidId);
    exports.it.shouldReturn404OnGet.with = itGet404;
    exports.it.shouldSupportPagination = (schema, query) => itPagination(api, schema, query);
    exports.it.shouldSupportPagination.with = itPagination;
    exports.it.shouldSupportCeqlSearch = (payload, field) => itCeqlSearch(api, payload, field);
    exports.it.shouldSupportCeqlSearch.with = itCeqlSearch;
    exports.it.shouldSupportPost = (payload, schema) => itPost(api, payload, schema);
    exports.it.shouldSupportPost.with = itPost;
    exports.it.shouldSupportCruds = (payload, schema, updateCb) => itCruds(api, payload, schema, updateCb);
    exports.it.shouldSupportCruds.with = itCruds;
    exports.it.shouldSupportCrud = (payload, schema, updateCb) => itCrud(api, payload, schema, updateCb);
    exports.it.shouldSupportCrud.with = itCrud;
    exports.it.shouldSupportCrd = (payload, schema) => itCrd(api, payload, schema);
    exports.it.shouldSupportCrd.with = itCrd;
    exports.it.shouldSupportCrds = (payload, schema) => itCrds(api, payload, schema);
    exports.it.shouldSupportCrds.with = itCrds;

    tests ? tests(api) : it('add some tests to me!!!', () => true);
  });
};
