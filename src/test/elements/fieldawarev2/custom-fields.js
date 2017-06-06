'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/custom-fields');

payload.name += tools.random();

suite.forElement('fsa', 'custom-fields', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearch('name');
});
