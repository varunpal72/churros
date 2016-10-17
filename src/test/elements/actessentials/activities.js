'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');

suite.forElement('crm', 'activities', { payload: payload }, (test) => {
  test.should.supportCrds();
  test.should.supportPagination();
  test.withOptions({qs:{where:'subject=\'Churros\''}}).should.return200OnGet();
});
