'use strict';

const util = require('util');
const chakram = require('chakram');
const expect = chakram.expect;
const cloud = require('core/cloud');

var exports = module.exports = {};

const itPost = (api, payload, schema) => {
  const name = util.format('should allow POST for %s', api);
  it(name, () => cloud.post(api, payload, schema));
};

const itGet = (api, schema, options) => {
  const name = util.format('should allow GET for %s', api);
  it(name, () => cloud.get(api, schema, options));
};

const itCrd = (api, payload, schema) => {
  const name = util.format('should allow CRD for %s', api);
  it(name, () => cloud.crd(api, payload, schema));
};

const itCrds = (api, payload, schema) => {
  const name = util.format('should allow CRDS for %s', api);
  it(name, () => cloud.crd(api, payload, schema));
};

const itCrud = (api, payload, schema, updateCb) => {
  const name = util.format('should allow CRUD for %s', api);
  it(name, () => cloud.crud(api, payload, schema, updateCb));
};

const itCruds = (api, payload, schema, updateCb) => {
  const name = util.format('should allow CRUDS for %s', api);
  it(name, () => cloud.cruds(api, payload, schema, updateCb));
};

const itPagination = (api, schema) => {
  const name = util.format('should allow paginating %s', api);
  const options = { qs: { page: 1, pageSize: 1 } };

  it(name, () => cloud.find(api, schema, options));
};

const itGet404 = (api, invalidId) => {
  const name = util.format('should throw a 404 when trying to retrieve a(n) %s with an ID that does not exist', api);
  if (invalidId) api = api + '/' + invalidId;
  it(name, () => cloud.get(api, (r) => expect(r).to.have.statusCode(404)));
};

const itPatch404 = (api, payload, invalidId) => {
  const name = util.format('should throw a 404 when trying to update a(n) %s with an ID that does not exist', api);
  if (invalidId) api = api + '/' + invalidId;
  it(name, () => cloud.update(api, (payload || {}), (r) => expect(r).to.have.statusCode(404), chakram.patch));
};

const itPost400 = (api, payload) => {
  let name = util.format('should throw a 400 when trying to create a(n) %s with an %s JSON body', api);
  payload ? name = util.format(name, 'invalid') : name = util.format(name, 'empty');
  it(name, () => cloud.post(api, payload, (r) => expect(r).to.have.statusCode(400)));
};

const itCeqlSearch = (api, payload, field) => {
  const name = util.format('should support searching %s by %s', api, field);
  it(name, () => {
    let id;
    return cloud.post(api, payload)
      .then(r => {
        id = r.body.id;
        const clause = util.format("%s='%s'", field, r.body[field]); // have to escape where values with single quotes
        const options = { qs: { where: clause } };
        return cloud.get(api, (r) => {
          expect(r).to.have.statusCode(200);
          expect(r.body.length).to.equal(1);
        }, options);
      })
      .then(r => cloud.delete(api + '/' + id));
  });
};

const runTests = (api, payload, schema, tests) => {
  const should = (api, schema, payload, options) => {
    return {
      return400OnPost: () => itPost400(api, payload),
      return404OnPatch: (invalidId) => itPatch404(api, payload, invalidId),
      return404OnGet: (invalidId) => itGet404(api, invalidId),
      return200OnPost: () => itPost(api, payload, schema),
      return200OnGet: () => itGet(api, schema, options),
      supportPagination: () => itPagination(api, schema),
      supportCeqlSearch: (field) => itCeqlSearch(api, payload, field),
      supportCruds: (updateCb) => itCruds(api, payload, schema, updateCb),
      supportCrud: (updateCb) => itCrud(api, payload, schema, updateCb),
      supportCrd: () => itCrd(api, payload, schema),
      supportCrds: () => itCrds(api, payload, schema),
    };
  };

  const using = (myApi, mySchema, myPayload, myOptions) => {
    return {
      should: should(myApi, mySchema, myPayload, myOptions),
      withApi: (myApi) => using(myApi, mySchema, myPayload, myOptions),
      withSchema: (mySchema) => using(myApi, mySchema, myPayload, myOptions),
      withJson: (myPayload) => using(myApi, mySchema, myPayload, myOptions),
      withOptions: (myOptions) => using(api, schema, payload, myOptions)
    };
  };

  const test = {
    api: api,
    should: should(api, schema, payload),
    withApi: (myApi) => using(myApi, schema, payload),
    withSchema: (mySchema) => using(api, mySchema, payload),
    withJson: (myPayload) => using(api, schema, myPayload),
    withOptions: (myOptions) => using(api, schema, payload, myOptions)
  };

  tests ? tests(test) : it('add some tests to me!!!', () => true);
};

exports.forElement = (hub, resource, payload, schema, tests) => {
  describe(resource, () => {
    let api = util.format('/hubs/%s/%s', hub, resource);
    runTests(api, payload, schema, tests);
  });
};

exports.forPlatform = (resource, payload, schema, tests) => {
  describe(resource, () => {
    let api = util.format('/%s', resource);
    runTests(api, payload, schema, tests);
  });
};
