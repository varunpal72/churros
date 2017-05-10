'use strict';

const suite = require('core/suite');
const payload = require('./assets/leads');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const leadsPayload = build({ email: tools.randomEmail() });

suite.forElement('marketing', 'leads', { payload: leadsPayload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.supportPagination();
  test.should.supportCeqlSearch('id');
});
