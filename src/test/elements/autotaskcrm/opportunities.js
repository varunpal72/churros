'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { where: 'title=\'ChurrosTestOpportunity\'' } }).should.return200OnGet();
  test.should.supportPagination();
});
