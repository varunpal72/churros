'use strict';

const http = require('http');
const fs = require('fs');
const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const assert = require('assert');
const tv4 = require('tv4');

var exports = module.exports = () => {
  chakram.addMethod('statusCode', (r, status) => {
    const responseStatus = r.response.statusCode;
    const responseBody = r.response.body;

    assert(
      responseStatus === status,
      'expected status code ' + responseStatus + ' to equal ' + status + '\nresponse body:\n' + JSON.stringify(responseBody, null, 2),
      'expected status code ' + responseStatus + ' not to equal ' + status + '\nresponse body:\n' + JSON.stringify(responseBody, null, 2)
    );
  });

  chakram.addMethod("schemaAnd200", (r, schema) => {
    const responseStatus = r.response.statusCode;
    const responseBody = r.response.body;

    const composeErrorMessage = () => {
      let errorMsg = 'expected body to match JSON schema\n';
      if (tv4.error !== null) {
        errorMsg += util.format('error:%s\n', tv4.error.message);
        errorMsg += util.format('expected schema:\n%s\n', JSON.stringify(schema, null, 2));
        errorMsg += util.format('response body:\n%s\n', JSON.stringify(responseBody, null, 2));
      }
      return errorMsg;
    };

    const is200 = responseStatus === 200;
    const message = util.format('expected %s to be 200.  response body was \n%s', responseStatus, JSON.stringify(responseBody, null, 2));
    assert(is200, message);

    const valid = tv4.validate(r.response.body, schema);
    assert(
      valid,
      composeErrorMessage(),
      'expected body to not match JSON schema ' + JSON.stringify(schema)
    );
  });

  return exports;
};

exports.for = (hub, objectName, tests) => {
  describe(objectName, () => {
    let api = hub ?
      util.format('/hubs/%s/%s', hub, objectName) :
      util.format('/%s', objectName);

    tests ?
      tests(api) :
      it('add some tests to me!!!', () => true);
  });
};

const logAndThrow = (msg, api, r) => {
  console.log(msg, api);
  throw r;
};

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

const post = (api, payload, schema) => {
  return chakram.post(api, payload)
    .then(r => validator(schema)(r))
    .catch(r => logAndThrow('Failed to create %s', api, r));
};
exports.post = post;

const get = (api, schema) => {
  return chakram.get(api)
    .then(r => validator(schema)(r))
    .catch(r => logAndThrow('Failed to retrieve %s', api, r));
};
exports.get = get;

const update = (api, payload, schema, cb) => {
  cb = (cb || chakram.patch);

  return cb(api, payload)
    .then(r => validator(schema)(r))
    .catch(r => logAndThrow('Failed to update %s: %s', api, r));
};
exports.patch = (api, payload, schema) => update(api, payload, schema, chakram.patch);
exports.put = (api, payload, schema) => update(api, payload, schema, chakram.put);

const remove = (api) => {
  return chakram.delete(api)
    .then(r => {
      expect(r).to.have.statusCode(200);
      return r;
    })
    .catch(r => logAndThrow('Failed to delete %s', api, r));
};
exports.delete = remove;

const find = (api, schema) => {
  return chakram.get(api)
    .then(r => validator(schema)(r))
    .catch(r => logAndThrow('Failed to find %s', api, r));
};
exports.find = find;

const postFile = (api, filePath, query, schema) => {
  const options = {
    formData: {
      file: fs.createReadStream(filePath)
    },
    qs: query
  };
  return chakram.post(api, undefined, options)
    .then(r => validator(schema)(r))
    .catch(r => logAndThrow('Failed to upload file to %s', api, r));
};
exports.postFile = postFile;

const crd = (api, payload, schema) => {
  return post(api, payload, schema)
    .then(r => get(api + '/' + r.body.id, schema))
    .then(r => remove(api + '/' + r.body.id));
};
exports.crd = crd;

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
  const options = {
    headers: {
      'Element-Instances': eiId
    }
  };

  console.log('Attempting to send %s events to %s', numEvents, api);
  let promises = [];
  for (var i = 0; i < numEvents; i++) {
    const response = chakram.post(api, payload, options);
    promises.push(response);
  }
  return chakram.all(promises);
};
exports.createEvents = createEvents;

const listenForEvents = (port, numEventsSent, waitSecs) => {
  let receivedEvents = 0;
  return new Promise((resolve, reject) => {
    http.createServer((request, response) => {
      response.end('{}');
      receivedEvents++;
      console.log('%s event(s) received', receivedEvents); // TODO - JJW - disable this logging unless in verbose mode after migrating to winston
      if (receivedEvents === numEventsSent) resolve(request);
    }).listen(port, "localhost", (err) => {
      err ? reject(err) : console.log('Waiting %s seconds to receive %s events on port %s', waitSecs, numEventsSent, port);
    });

    const msg = util.format('Did not receive all %s events before the %s second timer expired', numEventsSent, waitSecs);
    setTimeout(() => reject(msg), waitSecs * 1000);
  });
};
exports.listenForEvents = listenForEvents;

const testCrd = (api, payload, schema) => {
  const name = util.format('should allow CRD for %s', api);
  it(name, () => crd(api, payload, schema));
};

const testCrud = (api, payload, schema, updateCb) => {
  const name = util.format('should allow CRUD for %s', api);
  it(name, () => crud(api, payload, schema, updateCb));
};

const testCruds = (api, payload, schema, updateCb) => {
  const name = util.format('should allow CRUDS for %s', api);
  it(name, () => cruds(api, payload, schema, updateCb));
};

const testPaginate = (api, schema, query) => {
  const name = util.format('should allow paginating %s', api);
  api = util.format('%s?page=%s&pageSize=%s', api, 1, 1);
  it(name, () => find(api, schema));
};

const testBadGet404 = (api, invalidId) => {
  const name = util.format('should throw a 404 when trying to retrieve a(n) %s with an ID that does not exist', api);
  it(name, () => get(api + '/' + (invalidId || -1), (r) => expect(r).to.have.statusCode(404)));
};

const testBadPatch404 = (api, payload, invalidId) => {
  const name = util.format('should throw a 404 when trying to update a(n) %s with an ID that does not exist', api);
  it(name, () => {
    return update(api + '/' + (invalidId || -1), (payload || {}), (r) => expect(r).to.have.statusCode(404), chakram.patch);
  });
};

const testBadPost400 = (api, payload) => {
  let name = util.format('should throw a 400 when trying to create a(n) %s with an %s JSON body', api);
  payload ?
    name = util.format(name, 'invalid') :
    name = util.format(name, 'empty');

  it(name, () => post(api, payload, (r) => expect(r).to.have.statusCode(400)));
};

exports.test = {
  badPost400: testBadPost400,
  badPatch404: testBadPatch404,
  badGet404: testBadGet404,
  paginate: testPaginate,
  cruds: testCruds,
  crud: testCrud,
  crd: testCrd
};
