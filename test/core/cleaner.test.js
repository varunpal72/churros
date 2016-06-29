'use strict';

require('core/assertions');
const cleaner = require('core/cleaner');
const chakram = require('chakram');
const nock = require('nock');

const BASE_URL = 'https://api.cloud-elements.com/elements/api-v2;';
const AUTH = 'User fake, Organization fake';

describe('cleaner', () => {
  /* Setup our default chakram headers */
  before(() => chakram.setRequestDefaults({ baseUrl: BASE_URL, headers: { Authorization: AUTH } }));

  const formulas = [{ id: 123, name: 'foo' }, { id: 456, name: 'bar' }];

  const genFormulaInstance = (opts) => {
    opts = opts || {};
    return ({ id: opts.id || null, formula: { id: opts.id || null } });
  };

  const elementInstances = [{ id: 123, name: 'foo' }, { id: 456, name: 'bar' }];

  const headers = () => ({ reqheaders: { 'Authorization': (value) => value === AUTH } });

  it('should support cleaning up formulas by name', () => {
    nock(BASE_URL, headers())
      .get('/formulas')
      .reply(200, (uri, requestBody) => formulas)
      .get('/formulas/123/instances')
      .reply(200, () => [genFormulaInstance({ id: 123 })])
      .delete('/formulas/123/instances/123')
      .reply(200)
      .delete('/formulas/123')
      .reply(200);
    return cleaner.formulas.withName('foo');
  });

  it('should support cleaning up formulas with a list of names', () => {
    nock(BASE_URL, headers())
      .get('/formulas')
      .reply(200, (uri, requestBody) => formulas)
      .get('/formulas/123/instances')
      .reply(200, () => [genFormulaInstance({ id: 123 })])
      .get('/formulas/456/instances')
      .reply(200, () => [genFormulaInstance({ id: 456 })])
      .delete('/formulas/123/instances/123')
      .reply(200)
      .delete('/formulas/456/instances/456')
      .reply(200)
      .delete('/formulas/123')
      .reply(200)
      .delete('/formulas/456')
      .reply(200);
    return cleaner.formulas.withName(['foo', 'bar']);
  });

  it('should support cleaning up formulas with a name that does not match anything', () => {
    nock(BASE_URL, headers())
      .get('/formulas')
      .reply(200, (uri, requestBody) => formulas);
    return cleaner.formulas.withName('NameThatHasNoMatches');
  });

  it('should support cleaning up elements by name', () => {
    nock(BASE_URL, headers())
      .get('/instances')
      .reply(200, (uri, requestBody) => elementInstances)
      .delete('/instances/123')
      .reply(200);
    return cleaner.elements.withName('foo');
  });

  it('should support cleaning up elements with a list of names', () => {
    nock(BASE_URL, headers())
      .get('/instances')
      .reply(200, (uri, requestBody) => elementInstances)
      .delete('/instances/123')
      .reply(200)
      .delete('/instances/456')
      .reply(200);
    return cleaner.elements.withName(['foo', 'bar']);
  });
});
