'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const leadsPayload = tools.requirePayload(`${__dirname}/assets/leads.json`);

suite.forElement('marketing', 'leads', { payload: leadsPayload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.supportPagination();
  test.should.supportCeqlSearch('id');
});
