'use strict';

const chakram = require('chakram');
const expect = chakram.expect;
const cloud = require('core/cloud');
const logger = require('winston');

var exports = module.exports = {};

const itPost = (name, api, payload, options, validationCb) => {
  const n = name || `should allow POST for ${api}`;
  it(n, () => cloud.withOptions(options).post(api, payload, validationCb));
};

const itGet = (name, api, options, validationCb) => {
  const n = name || `should allow GET for ${api}`;
  it(n, () => cloud.withOptions(options).get(api, validationCb));
};

const itCrd = (name, api, payload, validationCb, options) => {
  const n = name || `should allow CRD for ${api}`;
  it(n, () => cloud.withOptions(options).crd(api, payload, validationCb));
};

const itCd = (name, api, payload, validationCb, options) => {
  const n = name || `should allow CD for ${api}`;
  it(n, () => cloud.withOptions(options).cd(api, payload, validationCb));
};

const itCrds = (name, api, payload, validationCb, options) => {
  const n = name || `should allow CRDS for ${api}`;
  it(n, () => cloud.withOptions(options).crds(api, payload, validationCb));
};

const itCrud = (name, api, payload, validationCb, updateCb, options) => {
  const n = name || `should allow CRUD for ${api}`;
  it(n, () => cloud.withOptions(options).crud(api, payload, validationCb, updateCb));
};

const itCruds = (name, api, payload, validationCb, updateCb, options) => {
  const n = name || `should allow CRUDS for ${api}`;
  it(n, () => cloud.withOptions(options).cruds(api, payload, validationCb, updateCb));
};

const itCrus = (name, api, payload, validationCb, updateCb, options) => {
  const n = name || `should allow CRUS for ${api}`;
  it(n, () => cloud.withOptions(options).crus(api, payload, validationCb, updateCb));
};

const itSr = (name, api, validationCb, options) => {
  const n = name || `should allow SR for ${api}`;
  it(n, () => cloud.withOptions(options).get(api).then(r => cloud.get(api + '/' + r.body[0].id)));
};

const itCrs = (name, api, payload, validationCb, options) => {
  const n = name || `should allow CRS for ${api}`;
  it(n, () => cloud.withOptions(options).crs(api, payload, validationCb));
};

const itPagination = (name, api, validationCb) => {
  const n = name || `should allow paginating with page and pageSize ${api}`;
  const options = { qs: { page: 1, pageSize: 1 } };

  it(n, () => cloud.withOptions(options).get(api, validationCb));
};

const paginate = (api, options, nextPage, page, max, all) => {
  if (page > max) return all;
  logger.debug(`finding page ${page} of results for ${api} using ${nextPage}`);

  options = options || {};
  options.qs = options.qs || {};
  options.qs.nextPage = nextPage;
  options.qs.pageSize = 1;

  return cloud.withOptions(options).get(api)
    .then(r => {
      expect(r.body).to.not.be.null;
      all = all.concat(r.body);
      return paginate(api, options, r.response.headers['elements-next-page-token'], page + 1, max, all);
    });
};

/**
 * Creates a few objects, and then, using our ?pageSize=x&nextPage=y pagination, tests out paginating this resource
 * @param  {string} name         The optional test name
 * @param  {string} api          The API resource
 * @param  {function} validationCb The optional validation CB
 */
const itNextPagePagination = (name, api, payload, amount, options, validationCb) => {
  const n = name || `should allow paginating with page and nextPage ${api}`;
  it(n, () => {
    const ids = [];
    const promises = [];
    amount = amount || 5;
    options = options || {};
    for (let i = 0; i < amount; i++) { promises.push(cloud.post(api, payload)); }

    return chakram.all(promises)
      .then(r => r.forEach(o => ids.push(o.body.id)))
      .then(r => paginate(api, options, null, 1, amount, []))
      .then(r => expect(r).to.have.length(amount))
      .then(r => ids.forEach(id => cloud.delete(`${api}/${id}`)));
  });
};

const it404 = (name, api, invalidId, method, cloudCb) => {
  const n = name || `should throw a 404 when trying to ${method} ${api} with an ID that does not exist`;
  if (invalidId) api = api + '/' + invalidId;
  it(n, () => cloudCb(api, (r) => expect(r).to.have.statusCode(404)));
};

const itUpdate404 = (name, api, payload, invalidId, method, chakramUpdateCb) => {
  const n = name || `should throw a 404 when trying to ${method} ${api} with an ID that does not exist`;
  if (invalidId) api = api + '/' + invalidId;
  it(n, () => cloud.update(api, (payload || {}), (r) => expect(r).to.have.statusCode(404), chakramUpdateCb));
};

const itPost400 = (name, api, payload) => {
  let n = name || `should throw a 400 when trying to create a(n) ${api} with an`;
  n += payload ? 'invalid JSON body' : 'empty JSON body';
  it(n, () => cloud.post(api, payload, (r) => expect(r).to.have.statusCode(400)));
};

const itCeqlSearch = (name, api, payload, field) => {
  const n = name || `should support searching ${api} by ${field}`;
  it(n, () => {
    let id;
    return cloud.post(api, payload)
      .then(r => {
        id = r.body.id;
        const clause = `${field}='${r.body[field]}'`; // have to escape where values with single quotes
        const options = { qs: { where: clause } };
        return cloud.withOptions(options).get(api, (r) => {
          expect(r).to.have.statusCode(200);
          expect(r.body.length).to.equal(1);
        });
      })
      .then(r => cloud.delete(api + '/' + id));
  });
};

const runTests = (api, payload, validationCb, tests) => {
  const should = (api, validationCb, payload, options, name) => ({
    return400OnPost: () => itPost400(name, api, payload),
    return404OnPatch: (invalidId) => itUpdate404(name, api, payload, invalidId, 'PATCH', chakram.patch),
    return404OnPut: (invalidId) => itUpdate404(name, api, payload, invalidId, 'PUT', chakram.put),
    return404OnGet: (invalidId) => it404(name, api, invalidId, 'GET', cloud.get),
    return404OnDelete: (invalidId) => it404(name, api, invalidId, 'DELETE', cloud.delete),
    return200OnPost: () => itPost(name, api, payload, options, validationCb),
    return200OnGet: () => itGet(name, api, options, validationCb),
    supportPagination: () => itPagination(name, api, validationCb),
    supportNextPagePagination: (amount) => itNextPagePagination(name, api, payload, amount, options, validationCb),
    supportCeqlSearch: (field) => itCeqlSearch(name, api, payload, field),
    supportCruds: (updateCb) => itCruds(name, api, payload, validationCb, updateCb, options),
    supportCrud: (updateCb) => itCrud(name, api, payload, validationCb, updateCb, options),
    supportCrus: (updateCb) => itCrus(name, api, payload, validationCb, updateCb, options),
    supportCrd: () => itCrd(name, api, payload, validationCb, options),
    supportCd: () => itCd(name, api, payload, validationCb, options),
    supportCrds: () => itCrds(name, api, payload, validationCb, options),
    supportSr: () => itSr(name, api, validationCb, options),
    supportCrs: () => itCrs(name, api, payload, validationCb, options),
  });

  const using = (myApi, myValidationCb, myPayload, myOptions, myName) => ({
    should: should(myApi, myValidationCb, myPayload, myOptions, myName),
    withName: (myName) => using(myApi, myValidationCb, myPayload, myOptions, myName),
    withApi: (myApi) => using(myApi, myValidationCb, myPayload, myOptions, myName),
    withValidation: (myValidationCb) => using(myApi, myValidationCb, myPayload, myOptions, myName),
    withJson: (myPayload) => using(myApi, myValidationCb, myPayload, myOptions, myName),
    withOptions: (myOptions) => using(api, validationCb, payload, myOptions, myName)
  });

  const test = {
    api: api,
    should: should(api, validationCb, payload),
    withName: (myName) => using(api, validationCb, payload, null, myName),
    withApi: (myApi) => using(myApi, validationCb, payload),
    withValidation: (myValidationCb) => using(api, myValidationCb, payload),
    withJson: (myPayload) => using(api, validationCb, myPayload),
    withOptions: (myOptions) => using(api, validationCb, payload, myOptions)
  };

  tests ? tests(test) : it('add some tests to me!!!', () => true);
};

exports.forElement = (hub, resource, payload, tests) => {
  describe(resource, () => runTests(`/hubs/${hub}/${resource}`, payload, (r) => expect(r).to.have.statusCode(200), tests));
};

/**
 * Starts up a new test suite for a platform resource.  This wraps all of the given tests in a mocha describe block, and
 * provides a bunch of convenience functions inside of the given tests under the 'test' object.

 * @param  {string} resource     The name of the platform resource you're testing
 * @param  {object} payload      The default JSON payload to go about creating one of these resources
 * @param  {function} schema     The schema to validate responses against
 * @param  {function} tests      A function, containing all tests
 */
exports.forPlatform = (resource, payload, schema, tests) => {
  describe(resource, () => runTests(`/${resource}`, payload, schema, tests));
};
