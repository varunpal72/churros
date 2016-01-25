'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;

var exports = module.exports = {};

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

const post = (api, payload, schema, validationCb) => {
  validationCb = (validationCb || ((r) => expect(r).to.have.schemaAnd200(schema)));

  return chakram.post(api, payload)
    .then(r => {
      validationCb(r);
      return r;
    })
    .catch(r => logAndThrow('Failed to create %s', api, r));
};
exports.post = post;

const get = (api, schema, validationCb) => {
  validationCb = (validationCb || ((r) => expect(r).to.have.schemaAnd200(schema)));

  return chakram.get(api)
    .then(r => {
      validationCb(r);
      return r;
    })
    .catch(r => logAndThrow('Failed to retrieve %s', api, r));
};
exports.get = get;

const update = (api, payload, schema, cb, validationCb) => {
  cb = (cb || chakram.patch);
  validationCb = (validationCb || ((r) => expect(r).to.have.schemaAnd200(schema)));

  return cb(api, payload)
    .then(r => {
      validationCb(r);
      return r;
    })
    .catch(r => logAndThrow('Failed to update %s: %s', api, r));
};
exports.patch = (api, payload, schema, validationCb) => update(api, payload, schema, chakram.patch, validationCb);
exports.put = (api, payload, schema, validationCb) => update(api, payload, schema, chakram.put, validationCb);

const remove = (api) => {
  return chakram.delete(api)
    .then(r => {
      expect(r).to.have.statusCode(200);
      return r;
    })
    .catch(r => logAndThrow('Failed to delete %s', api, r));
};
exports.delete = remove;

const find = (api, schema, validationCb) => {
  validationCb = (validationCb || ((r) => expect(r).to.have.schemaAnd200(schema)));

  return chakram.get(api)
    .then(r => {
      validationCb(r);
      return r;
    })
    .catch(r => logAndThrow('Failed to find %s', api, r));
};
exports.find = find;

const crd = (api, payload, schema) => {
  return post(api, payload, schema)
    .then(r => get(api + '/' + r.body.id, schema))
    .then(r => remove(api + '/' + r.body.id));
};
exports.crd = crd;

const crud = (api, payload, schema, updateCallback) => {
  return post(api, payload, schema)
    .then(r => get(api + '/' + r.body.id, schema))
    .then(r => update(api + '/' + r.body.id, payload, schema, updateCallback))
    .then(r => remove(api + '/' + r.body.id));
};
exports.crud = crud;

const cruds = (api, payload, schema, updateCallback) => {
  let createdId = -1;
  return post(api, payload, schema)
    .then(r => {
      createdId = r.body.id;
      return get(api + '/' + createdId, schema);
    })
    .then(r => update(api + '/' + createdId, payload, schema, updateCallback))
    .then(r => find(api, schema))
    .then(r => remove(api + '/' + createdId));
};
exports.cruds = cruds;

const testCrd = (api, payload, schema) => {
  const name = util.format('should allow CRD for %s', api);
  it(name, () => crd(api, payload, schema));
};

const testCrud = (api, payload, schema, updateCallback) => {
  const name = util.format('should allow CRUD for %s', api);
  it(name, () => crud(api, payload, schema, updateCallback));
};

const testCruds = (api, payload, schema, updateCallback) => {
  const name = util.format('should allow CRUDS for %s', api);
  it(name, () => cruds(api, payload, schema, updateCallback));
};

const testPaginate = (api, schema, query) => {
  const name = util.format('should allow paginating %s', api);
  api = util.format('%s?page=%s&pageSize=%s', api, 1, 1);
  it(name, () => find(api, schema));
};

const testBadGet404 = (api, invalidId) => {
  const name = util.format('should throw a 404 when trying to retrieve a(n) %s that does not exist', api);
  it(name, () => get(api + '/' + (invalidId || -1), null, (r) => expect(r).to.have.statusCode(404)));
};

const testBadPatch404 = (api, payload, invalidId) => {
  const name = util.format('should throw a 404 when trying to update a(n) %s that does not exist', api);
  it(name, () => {
    return update(api + '/' + (invalidId || -1), (payload || {}), null, chakram.patch, (r) => {
      expect(r).to.have.statusCode(404);
    });
  });
};

const testBadPost400 = (api, payload) => {
  let name = util.format('should throw a 400 when trying to create a(n) %s with an %s JSON body', api);
  payload ?
    name = util.format(name, 'invalid') :
    name = util.format(name, 'empty');

  it(name, () => post(api, payload, null, (r) => expect(r).to.have.statusCode(400)));
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
