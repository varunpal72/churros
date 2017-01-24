'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/custom-fields');

payload.name += tools.random();

suite.forElement('fsa', 'custom-fields', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('name');
});
