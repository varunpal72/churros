/**
 * The core/suite module kicks off any test suite for an element or a platform resource.  This provides many convenience
 * functions under the `test` Object that it hands back to you.
 * @module core/suite
 */
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

const itS = (name, api, validationCb, options) => {
  const n = name || `should allow S for ${api}`;
  it(n, () => cloud.withOptions(options).get(api));
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

const paginate = (api, options, validationCb, nextPage, page, max, all) => {
  if (page > max) return all;
  logger.debug(`finding page ${page} of results for ${api} using ${nextPage}`);

  options = options || {};
  options.qs = options.qs || {};
  options.qs.nextPage = nextPage;
  options.qs.pageSize = 1;

  return cloud.withOptions(options).get(api, validationCb)
    .then(r => {
      expect(r.body).to.not.be.null;
      all = all.concat(r.body);
      return paginate(api, options, validationCb, r.response.headers['elements-next-page-token'], page + 1, max, all);
    });
};

const itNextPagePagination = (name, api, payload, amount, shouldCreate, options, validationCb) => {
  const itNextPagePaginationCreate = () => {
    const ids = [];
    const promises = [];
    amount = amount || 5;
    options = options || {};
    for (let i = 0; i < amount; i++) { promises.push(cloud.post(api, payload)); }

    return chakram.all(promises)
      .then(r => r.forEach(o => ids.push(o.body.id)))
      .then(r => paginate(api, options, validationCb, null, 1, amount, []))
      .then(r => expect(r).to.have.length(amount))
      .then(r => ids.forEach(id => cloud.delete(`${api}/${id}`)));
  };

  const itNextPagePagination = () => {
    return paginate(api, options, validationCb, null, 1, amount, [])
      .then(r => expect(r).to.have.length(amount));
  };

  const n = name || `should allow paginating with page and nextPage ${api}`;
  it(n, () => {
    return shouldCreate ?
      itNextPagePaginationCreate() :
      itNextPagePagination();
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

const itPostError = (name, httpCode, api, payload) => {
  const suffix = payload ? 'invalid JSON body' : 'empty JSON body';
  let n = name || `should throw a ${httpCode} when trying to create a(n) ${api} with an ${suffix}`;
  it(n, () => cloud.post(api, payload, (r) => expect(r).to.have.statusCode(httpCode)));
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
    /**
     * HTTP POST that validates that the response is a 400
     * @memberof module:core/suite.test.should
     */
    return400OnPost: () => itPostError(name, 400, api, payload),
    /**
     * HTTP POST that validates that the response is a 409
     * @memberof module:core/suite.test.should
     */
    return409OnPost: () => itPostError(name, 409, api, payload),
    /**
     * HTTP PATCH that validates that the response is a 404
     * @param {string} [invalidId=-1] The invalid ID
     * @memberof module:core/suite.test.should
     */
    return404OnPatch: (invalidId) => itUpdate404(name, api, payload, invalidId, 'PATCH', chakram.patch),
    /**
     * HTTP PUT that validates that the response is a 404
     * @param {string} [invalidId=-1] The invalid ID
     * @memberof module:core/suite.test.should
     */
    return404OnPut: (invalidId) => itUpdate404(name, api, payload, invalidId, 'PUT', chakram.put),
    /**
     * HTTP GET that validates that the response is a 404
     * @param {string} [invalidId=-1] The invalid ID
     * @memberof module:core/suite.test.should
     */
    return404OnGet: (invalidId) => it404(name, api, invalidId, 'GET', cloud.get),
    /**
     * HTTP DELETE that validates that the response is a 404
     * @param {string} [invalidId=-1] The invalid ID
     * @memberof module:core/suite.test.should
     */
    return404OnDelete: (invalidId) => it404(name, api, invalidId, 'DELETE', cloud.delete),
    /**
     * HTTP POST that validates that the response is a 200
     * @memberof module:core/suite.test.should
     */
    return200OnPost: () => itPost(name, api, payload, options, validationCb),
    /**
     * HTTP GET that validates that the response is a 200
     * @memberof module:core/suite.test.should
     */
    return200OnGet: () => itGet(name, api, options, validationCb),
    /**
     * Validates that the given API `page` and `pageSize` pagination.  In order to test this, we create a few objects and then paginate
     * through the results before cleaning up any resources that were created.
     * @memberof module:core/suite.test.should
     */
    supportPagination: () => itPagination(name, api, validationCb),
    /**
     * Validates that the given API supports `nextPageToken` type pagination.
     * @param {number} amount The number of objects to paginate through
     * @param {boolean} shouldCreate  Should we create objects to paginate through?
     * @memberof module:core/suite.test.should
     */
    supportNextPagePagination: (amount, shouldCreate) => itNextPagePagination(name, api, payload, amount, shouldCreate, options, validationCb),
    /**
     * Validates that the given API resource supports searching by a CEQL query.
     * @param {string} field The field to search by
     * @memberof module:core/suite.test.should
     */
    supportCeqlSearch: (field) => itCeqlSearch(name, api, payload, field),
    /**
     * Validates that the given API resource supports CRUDS
     * @param {Function} [updateCb=chakram.put] The update callback (`chakram.patch` can also be used)
     * @memberof module:core/suite.test.should
     */
    supportCruds: (updateCb) => itCruds(name, api, payload, validationCb, updateCb, options),
    /**
     * Validates that the given API resource supports CRUD
     * @param {Function} [updateCb=chakram.put] The update callback (`chakram.patch` can also be used)
     * @memberof module:core/suite.test.should
     */
    supportCrud: (updateCb) => itCrud(name, api, payload, validationCb, updateCb, options),
    /**
     * Validates that the given API resource supports CRUS
     * @param {Function} [updateCb=chakram.put] The update callback (`chakram.patch` can also be used)
     * @memberof module:core/suite.test.should
     */
    supportCrus: (updateCb) => itCrus(name, api, payload, validationCb, updateCb, options),
    /**
     * Validates that the given API resource supports CRD
     * @memberof module:core/suite.test.should
     */
    supportCrd: () => itCrd(name, api, payload, validationCb, options),
    /**
     * Validates that the given API resource supports CD
     * @memberof module:core/suite.test.should
     */
    supportCd: () => itCd(name, api, payload, validationCb, options),
    /**
     * Validates that the given API resource supports CRDS
     * @memberof module:core/suite.test.should
     */
    supportCrds: () => itCrds(name, api, payload, validationCb, options),
    /**
     * Validates that the given API resource supports RS
     * @memberof module:core/suite.test.should
     */
    supportSr: () => itSr(name, api, validationCb, options),
    /**
     * Validates that the given API resource supports
     * @memberof module:core/suite.test.should
     */
    supportS: () => itS(name, api, validationCb, options),
    /**
     * Validates that the given API resource supports CRS
     * @memberof module:core/suite.test.should
     */
    supportCrs: () => itCrs(name, api, payload, validationCb, options),
  });

  const using = (myApi, myValidationCb, myPayload, myOptions, myName) => ({
    should: should(myApi, myValidationCb, myPayload, myOptions, myName),
    withName: (myName) => using(myApi, myValidationCb, myPayload, myOptions, myName),
    withApi: (myApi) => using(myApi, myValidationCb, myPayload, myOptions, myName),
    withValidation: (myValidationCb) => using(myApi, myValidationCb, myPayload, myOptions, myName),
    withJson: (myPayload) => using(myApi, myValidationCb, myPayload, myOptions, myName),
    withOptions: (myOptions) => using(myApi, myValidationCb, myPayload, myOptions, myName)
  });

  /**
   * The test namespace which is generated for any `suite.forElement` or `suite.forPlatform` functions.  This context
   * contains many helpful functions that can drastically simplify test writing for CE APIs
   * @memberof module:core/suite
   * @namespace test
   */
  const test = {
    api: api,
    /**
     * The should namespace contains many standard test cases that wrap mocha `it` blocks.  This can be chained with any
     * of the other available functions underneath the `test` namespace.  Some examples:
     * ```
     * test
     *  .should.return200OnGet();
     *
     * test
     *  .withApi('/hubs/crm/accounts')
     *  .should.return200OnGet();
     *
     * test
     *  .withApi('/hubs/crm/accounts')
     *  .withValidationCb((r) => expect(r).to.have.statusCode(200))
     *  .should.return200OnGet();
     * ```
     * @memberof module:core/suite.test
     * @namespace should
     */
    should: should(api, validationCb, payload),
    /**
     * Overrides the default name for any tests
     * @param {string} myName The name of the test
     * @memberof module:core/suite.test
     * @namespace withName
     */
    withName: (myName) => using(api, validationCb, payload, null, myName),
    /**
     * Overrides the default API for any tests
     * @param {string} myApi The API to override with
     * @memberof module:core/suite.test
     * @namespace withApi
     */
    withApi: (myApi) => using(myApi, validationCb, payload),
    /**
     * Overrides the default validator for any tests
     * @param {Function} myValidationCb The validation function
     * @memberof module:core/suite.test
     * @namespace withValidation
     */
    withValidation: (myValidationCb) => using(api, myValidationCb, payload),
    /**
     * Overrides the default JSON payload that will be used for any create or update API calls
     * @param {Object} myPayload The JSON payload
     * @memberof module:core/suite.test
     * @namespace withValidation
     */
    withJson: (myPayload) => using(api, validationCb, myPayload),
    /**
     * Specifies that any API calls made should use the given request options
     * @param {Object} myOptions The request options to override with
     * @memberof module:core/suite.test
     * @namespace withOptions
     */
    withOptions: (myOptions) => using(api, validationCb, payload, myOptions)
  };

  tests ? tests(test) : it('add some tests to me!!!', () => true);
};

const run = (api, resource, options, defaultValidation, tests) => {
  // if options is a function, we're assuming those are the tests
  if (typeof options === 'function') {
    tests = options;
    options = {};
  }

  options = options || {};
  const name = options.name || resource;
  if (options.skip) {
    describe.skip(name, () => runTests(api, options.payload, defaultValidation, tests));
  } else {
    describe(name, () => runTests(api, options.payload, defaultValidation, tests));
  }
};

/**
 * Starts up a new test suite for an element.  This wraps all of the given tests in a mocha describe block, and provides
 * a bunch of convenience functions inside of the given tests under the 'test' object.

 * @param  {string} hub       The hub that this element is in (i.e. crm, marketing, etc.)
 * @param  {string} resource  The name of the elements API resource this test suite is for
 * @param  {object} options   The, optional, suite options:
 * {
 *   name: mochaDescribeNameThatOverridesTheResourceName,
 *   payload: defaultPaylodThatWillBeUsedOnPostCalls,
 *   schema: defaultValidationThatWillHappenOnAllApiCallsExceptDeletes
 * }
 * @param  {Function} tests   A function, containing all test
 */
exports.forElement = (hub, resource, options, tests) => run(`/hubs/${hub}/${resource}`, resource, options, (r) => expect(r).to.have.statusCode(200), tests);

/**
 * Starts up a new test suite for a platform resource.  This wraps all of the given tests in a mocha describe block, and
 * provides a bunch of convenience functions inside of the given tests under the 'test' object.

 * @param  {string} resource     The name of the platform API resource this test suite is for
 * @param  {object} options      The, optional, suite options:
 * {
 *   name: mochaDescribeNameThatOverridesTheResourceName,
 *   payload: defaultPaylodThatWillBeUsedOnPostCalls,
 *   schema: defaultValidationThatWillHappenOnAllApiCallsExceptDeletes
 * }
 * @param  {Function} tests      A function, containing all tests
 */
exports.forPlatform = (resource, options, tests) => run(`/${resource}`, resource, options, options.schema, tests);
