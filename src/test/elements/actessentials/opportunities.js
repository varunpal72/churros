'use strict';

const suite = require('core/suite');
const payload = require('./assets/opportunities');

suite.forElement('crm', 'opportunities', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.withOptions({ qs:{ where:'title=\'Churro opportunity\''} }).should.return200OnGet();
});
