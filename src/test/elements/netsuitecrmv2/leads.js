'use strict';

const suite = require('core/suite');
const payload =  require('core/tools').requirePayload(`${__dirname}/assets/leads.json`);

suite.forElement('crm', 'leads', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.should.supportCeqlSearch('id');
});
